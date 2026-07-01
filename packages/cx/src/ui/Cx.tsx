/** @jsxImportSource react */

import { Widget, VDOM, getContent } from "./Widget";
import { Instance } from "./Instance";
import { RenderingContext } from "./RenderingContext";
import { debug, appDataFlag } from "../util/Debug";
import { Timing, now, appLoopFlag, vdomRenderFlag } from "../util/Timing";
import {
   isBatchingUpdates,
   notifyBatchedUpdateStarting,
   notifyBatchedUpdateCompleted,
   hasBatchedUpdateSubscribers,
} from "./batchUpdates";
import { shallowEquals } from "../util/shallowEquals";
import { PureContainer } from "./PureContainer";
import { onIdleCallback } from "../util/onIdleCallback";
import { getCurrentCulture, pushCulture, popCulture, CultureInfo, ResolvedCultureInfo } from "./Culture";
import { View } from "../data/View";
import { Config } from "./Prop";

// On by default. Cx coalesces re-entrant synchronous updates and, once a burst grows deep, yields to a
// microtask so React's global per-root nested-update counter resets before continuing -- preventing
// "Maximum update depth exceeded" on large renders that write to the store while they render (e.g. a
// several-hundred-page report). For updates that settle in a single render -- virtually all of them --
// this is equivalent to the previous behavior; it only diverges under a deep re-entrant render burst.
// If you suspect it causes trouble, opt out at app startup with disableSyncUpdateCoalescing() -- and
// please report the issue so it can be fixed.
let coalesceSyncUpdates = true;

// Consecutive commit-phase re-render rounds allowed before Cx yields to a microtask. Kept under React's
// ~50 nested-update limit (which is global to the root, not per component); the default trades a little
// initial-render time for a safety margin. Override via enableSyncUpdateCoalescing(limit) if needed.
let syncBurstLimit = 35;

export function enableSyncUpdateCoalescing(limit?: number): void {
   coalesceSyncUpdates = true;
   if (limit != null) syncBurstLimit = limit;
}
export function disableSyncUpdateCoalescing(): void {
   coalesceSyncUpdates = false;
}

// Module-global because React's nested-update limit is global to the root, not per component. A large
// initial render can re-render the root Cx and every detached page Restate hundreds of times in one
// synchronous burst; once the burst grows past syncBurstLimit we yield so React's commit finishes
// without a synchronously-scheduled follow-up (which resets its counter) before we render again.
let activeSyncUpdates = 0; // Cx instances with a synchronous setState in flight
let syncBurstRounds = 0; // commit-phase re-render rounds issued since the last yield / burst start

export interface CxProps {
   widget?: Config;
   items?: Config;
   store?: View;
   instance?: Instance;
   parentInstance?: Instance;
   subscribe?: boolean;
   immediate?: boolean;
   deferredUntilIdle?: boolean;
   idleTimeout?: number;
   options?: any;
   onError?: (error: Error, instance: Instance, info: any) => void;
   params?: any;
   contentFactory?: (props: { children: any }) => any;
   cultureInfo?: ResolvedCultureInfo;
}

export interface CxState {
   deferToken: number;
   data?: any;
}

export class Cx extends VDOM.Component<CxProps, CxState> {
   widget: Widget;
   store: View;
   parentInstance?: Instance;
   instance?: Instance;
   flags: { preparing?: boolean; dirty?: boolean; rendering?: boolean };
   renderCount: number;
   unsubscribe?: () => void;
   componentDidCatch?: (error: Error, info: any) => void;
   forceUpdateCallback: () => void;
   deferCounter: number;
   pendingUpdateTimer?: NodeJS.Timeout;
   unsubscribeIdleRequest?: () => void;
   // true while a coalesced synchronous setState is in flight for this Cx (re-entrancy guard for update());
   // only used when coalesceSyncUpdates is enabled
   stateUpdateInFlight: boolean = false;

   constructor(props: CxProps) {
      super(props);

      if (props.instance) {
         this.widget = (props.instance as any).widget;
         this.store = (props.instance as any).store;
      } else {
         this.widget = PureContainer.create({ items: props.widget || props.items });

         if (props.parentInstance) {
            this.parentInstance = props.parentInstance;
            this.store = props.store || (this.parentInstance as any).store;
         } else {
            this.parentInstance = new Instance(this.widget, "0", undefined, props.store);
            this.store = props.store!;
         }

         if (!this.store) throw new Error("Cx component requires a store.");
      }

      this.state = {
         deferToken: 0,
         data: props.subscribe ? this.store.getData() : null,
      };

      if (props.subscribe) {
         this.unsubscribe = this.store.subscribe(this.update.bind(this));
      }

      this.onStateUpdateCompleted = this.onStateUpdateCompleted.bind(this);

      this.flags = {};
      this.renderCount = 0;

      if (props.onError) this.componentDidCatch = this.componentDidCatchHandler.bind(this);

      this.forceUpdateCallback = this.forceUpdate.bind(this);

      this.deferCounter = 0;
      this.waitForIdle();
   }

   UNSAFE_componentWillReceiveProps(props: CxProps): void {
      let newStore = props.instance
         ? (props.instance as any).store
         : props.store
           ? props.store
           : (props.parentInstance as any).store;

      if (newStore != this.store) {
         this.store = newStore;
         if (this.unsubscribe) this.unsubscribe();
         if (props.subscribe) this.unsubscribe = this.store.subscribe(this.update.bind(this));
      }

      if (props.subscribe) {
         let data = this.store.getData();
         if (data !== this.state.data) {
            this.waitForIdle();
            this.setState({ data });
         }
      }
   }

   getInstance(): Instance {
      if (this.props.instance) return this.props.instance;

      if (this.instance && this.instance.widget === this.widget) {
         if (this.instance.parentStore != this.store) this.instance.setParentStore(this.store);
         return this.instance;
      }

      if (this.widget && this.parentInstance)
         return (this.instance = this.parentInstance.getDetachedChild(this.widget, "0", this.store));

      throw new Error("Could not resolve a widget instance in the Cx component.");
   }

   render() {
      if (this.props.deferredUntilIdle && this.state.deferToken < this.deferCounter) return null;

      let cultureInfo = this.props.cultureInfo ?? getCurrentCulture();

      return (
         <CxContext
            instance={this.getInstance()}
            flags={this.flags}
            options={this.props.options}
            buster={++this.renderCount}
            contentFactory={this.props.contentFactory}
            forceUpdate={this.forceUpdateCallback}
            cultureInfo={cultureInfo}
         />
      );
   }

   componentDidMount(): void {
      this.componentDidUpdate();

      if (this.props.options && this.props.options.onPipeUpdate)
         this.props.options.onPipeUpdate(this.update.bind(this));
   }

   componentDidUpdate(): void {
      if (this.flags.dirty) {
         this.update();
      }
   }

   update(): void {
      let data = this.store.getData();
      debug(appDataFlag, data);
      if (this.flags.preparing) this.flags.dirty = true;
      // Synchronous path: while batching (incl. batchUpdatesAndNotify, which page-breaking relies on) or for
      // `immediate` instances.
      else if (this.props.immediate || isBatchingUpdates()) {
         if (!coalesceSyncUpdates) {
            // Opt-out path (disableSyncUpdateCoalescing()): the original behavior -- render synchronously
            // for every update, no coalescing.
            notifyBatchedUpdateStarting();
            this.setState({ data: data }, notifyBatchedUpdateCompleted);
            return;
         }
         // Coalescing enabled: at most one setState may be in flight per Cx. Re-entrant update() calls (the
         // render itself writing to the store, as happens throughout a large initial render) are skipped --
         // the in-flight round re-reads the store on completion (see onStateUpdateCompleted), so nothing is
         // dropped. Nesting these setStates deep is what trips React's "Maximum update depth exceeded".
         if (this.stateUpdateInFlight) return;
         if (activeSyncUpdates === 0) syncBurstRounds = 0; // fresh burst -> reset the shared round counter
         activeSyncUpdates++;
         this.stateUpdateInFlight = true;
         notifyBatchedUpdateStarting();
         this.issueSyncSetState();
      } else {
         // standard mode: coalesce sequential store commands into a single deferred update
         this.scheduleStateUpdate();
      }
   }

   // Issue the next synchronous render round (coalescing path). Once a burst grows past SYNC_BURST_LIMIT we
   // render from a microtask instead, so React's commit finishes without a synchronously-scheduled follow-up
   // and its global nested-update counter resets before we continue. The yield is suppressed while a
   // batchUpdatesAndNotify is in flight: page-breaking convergence is shallow, so staying fully synchronous
   // keeps its notify callback firing right after the change commits (and the counter never gets near 50).
   issueSyncSetState(): void {
      if (hasBatchedUpdateSubscribers() || ++syncBurstRounds <= syncBurstLimit) {
         this.setState({ data: this.store.getData() }, this.onStateUpdateCompleted);
      } else {
         queueMicrotask(() => {
            // The event loop has turned, so React's global nested-update counter has reset; realign ours.
            // Resetting here (not before scheduling) keeps the counter high through the rest of the current
            // commit, so any other Cx re-arming in the same commit also yields instead of extending the chain.
            syncBurstRounds = 0;
            if (this.stateUpdateInFlight)
               this.setState({ data: this.store.getData() }, this.onStateUpdateCompleted);
         });
      }
   }

   scheduleStateUpdate() {
      if (!this.pendingUpdateTimer) {
         notifyBatchedUpdateStarting();
         this.pendingUpdateTimer = setTimeout(() => {
            delete this.pendingUpdateTimer;
            // read fresh data at fire time so the coalesced update renders the latest store state
            this.setState({ data: this.store.getData() }, notifyBatchedUpdateCompleted);
         }, 0);
      }
   }

   // Completion callback for the coalescing path's setState. React runs it after the commit, so the DOM
   // already reflects this render. If the render wrote to the store, run another round -- keeping the
   // batched-update accounting balanced (open the next round before closing this one) so `finished` never
   // catches `pending` mid-convergence and batchUpdatesAndNotify resolves only at the store fixpoint.
   // Otherwise the burst has settled: clear the in-flight flag and report completion.
   onStateUpdateCompleted() {
      if (this.state.data === this.store.getData()) {
         // Converged: the store didn't change while this round rendered, so the DOM is up to date.
         this.stateUpdateInFlight = false;
         activeSyncUpdates--;
         notifyBatchedUpdateCompleted();
         return;
      }
      notifyBatchedUpdateStarting(); // open the next round
      notifyBatchedUpdateCompleted(); // close this one
      this.issueSyncSetState();
   }

   waitForIdle(): void {
      if (!this.props.deferredUntilIdle) return;

      if (this.unsubscribeIdleRequest) this.unsubscribeIdleRequest();

      let token = ++this.deferCounter;
      this.unsubscribeIdleRequest = onIdleCallback(
         () => {
            this.setState({ deferToken: token });
         },
         {
            timeout: this.props.idleTimeout || 30000,
         },
      );
   }

   componentWillUnmount(): void {
      if (this.stateUpdateInFlight) {
         // Release the open pending round so a waiting batchUpdatesAndNotify can settle instead of waiting
         // out its fallback timeout, and keep the shared in-flight refcount balanced.
         this.stateUpdateInFlight = false;
         activeSyncUpdates--;
         notifyBatchedUpdateCompleted();
      }
      if (this.pendingUpdateTimer) clearTimeout(this.pendingUpdateTimer);
      if (this.unsubscribeIdleRequest) this.unsubscribeIdleRequest();
      if (this.unsubscribe) this.unsubscribe();
      if (this.props.options && this.props.options.onPipeUpdate) this.props.options.onPipeUpdate(null);
   }

   shouldComponentUpdate(props: CxProps, state: CxState): boolean {
      if (props.deferredUntilIdle && state.deferToken != this.deferCounter) return false;

      return (
         state !== this.state ||
         !props.params ||
         !shallowEquals(props.params, this.props.params) ||
         props.instance !== this.props.instance ||
         props.widget !== this.props.widget ||
         props.store !== this.props.store ||
         props.parentInstance !== this.props.parentInstance ||
         props.cultureInfo !== this.props.cultureInfo
      );
   }

   componentDidCatchHandler(error: Error, info: any): void {
      this.flags.preparing = false;
      this.props.onError!(error, this.getInstance(), info);
   }
}

interface CxContextProps {
   instance: Instance;
   flags: { preparing?: boolean; dirty?: boolean; rendering?: boolean };
   options?: any;
   buster: number;
   contentFactory?: (props: { children: any }) => any;
   forceUpdate: () => void;
   cultureInfo?: ResolvedCultureInfo;
}

class CxContext extends VDOM.Component<CxContextProps, {}> {
   renderCount: number;
   timings: any;
   content: any;
   renderingContext?: RenderingContext;

   constructor(props: CxContextProps) {
      super(props);
      this.renderCount = 0;
      this.UNSAFE_componentWillReceiveProps(props);
   }

   UNSAFE_componentWillReceiveProps(props: CxContextProps): void {
      this.timings = {
         start: now(),
      };

      let { instance, options, contentFactory } = props;
      let count = 0,
         visible,
         context,
         forceContinue;

      //should not be tracked by parents for destroy
      if (!(instance as any).detached)
         throw new Error("The instance passed to a Cx component should be detached from its parent.");

      if (this.props.instance !== instance && (this.props.instance as any).destroyTracked)
         (this.props.instance as any).destroy();

      this.props.flags.preparing = true;

      if (this.props.cultureInfo) pushCulture(this.props.cultureInfo);

      try {
         do {
            count++;
            forceContinue = false;
            context = new RenderingContext(options);
            (context as any).forceUpdate = this.props.forceUpdate;
            this.props.flags.dirty = false;
            (instance as any).assignedRenderList = (context as any).getRootRenderList();
            visible = (instance as any).scheduleExploreIfVisible(context);
            if (visible) {
               while (!(context as any).exploreStack.empty()) {
                  let inst = (context as any).exploreStack.pop();
                  //console.log("EXPLORE", inst.widget.constructor.name, inst.widget.tag, inst.widget.widgetId);
                  (inst as any).explore(context);
               }
            } else if ((instance as any).destroyTracked) {
               (instance as any).destroy();
            }

            if (this.props.flags.dirty && count <= 3 && Widget.optimizePrepare && now() - this.timings.start < 8) {
               forceContinue = true;
               continue;
            }

            if (visible) {
               this.timings.afterExplore = now();

               for (let i = 0; i < (context as any).prepareList.length; i++)
                  (context as any).prepareList[i].prepare(context);
               this.timings.afterPrepare = now();
            }
         } while (
            forceContinue ||
            (this.props.flags.dirty && count <= 3 && Widget.optimizePrepare && now() - this.timings.start < 8)
         );

         if (visible) {
            //walk in reverse order so children get rendered first
            let renderList = (context as any).getRootRenderList();
            while (renderList) {
               for (let i = renderList.data.length - 1; i >= 0; i--) {
                  renderList.data[i].render(context);
               }
               renderList = renderList.right;
            }

            this.content = getContent((instance as any).vdom);
            if (contentFactory) this.content = contentFactory({ children: this.content });
            this.timings.afterRender = now();
            for (let i = 0; i < (context as any).cleanupList.length; i++)
               (context as any).cleanupList[i].cleanup(context);
         } else {
            this.content = null;
            this.timings.afterExplore = this.timings.afterPrepare = this.timings.afterRender = now();
         }
      } finally {
         if (this.props.cultureInfo) popCulture(this.props.cultureInfo);
      }

      this.timings.beforeVDOMRender = now();
      this.props.flags.preparing = false;
      this.props.flags.rendering = true;
      this.renderingContext = context;
   }

   render() {
      return this.content;
   }

   componentDidMount(): void {
      this.componentDidUpdate();
   }

   componentDidUpdate(): void {
      this.props.flags.rendering = false;
      this.timings.afterVDOMRender = now();

      //let {instance} = this.props;
      //instance.cleanup(this.renderingContext);

      this.timings.afterCleanup = now();
      this.renderCount++;

      if (process.env.NODE_ENV !== "production") {
         let { start, beforeVDOMRender, afterVDOMRender, afterPrepare, afterExplore, afterRender, afterCleanup } =
            this.timings;

         Timing.log(
            vdomRenderFlag,
            this.renderCount,
            "cx",
            (beforeVDOMRender - start + afterCleanup - afterVDOMRender).toFixed(2) + "ms",
            "vdom",
            (afterVDOMRender - beforeVDOMRender).toFixed(2) + "ms",
         );

         Timing.log(
            appLoopFlag,
            this.renderCount,
            (this.renderingContext as any).options.name || "main",
            "total",
            (afterCleanup - start).toFixed(1) + "ms",
            "explore",
            (afterExplore - start).toFixed(1) + "ms",
            "prepare",
            (afterPrepare - afterExplore).toFixed(1),
            "render",
            (afterRender - afterPrepare).toFixed(1),
            "vdom",
            (afterVDOMRender - beforeVDOMRender).toFixed(1),
            "cleanup",
            (afterCleanup - afterVDOMRender).toFixed(1),
         );
      }
   }

   componentWillUnmount(): void {
      let { instance } = this.props;
      if ((instance as any).destroyTracked) (instance as any).destroy();
   }
}
