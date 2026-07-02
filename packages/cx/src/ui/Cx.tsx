/** @jsxImportSource react */

import { Widget, VDOM, getContent } from "./Widget";
import { Instance } from "./Instance";
import { RenderingContext } from "./RenderingContext";
import { debug, appDataFlag } from "../util/Debug";
import { Timing, now, appLoopFlag, vdomRenderFlag } from "../util/Timing";
import { isBatchingUpdates, notifyBatchedUpdateStarting, notifyBatchedUpdateCompleted } from "./batchUpdates";
import { shallowEquals } from "../util/shallowEquals";
import { PureContainer } from "./PureContainer";
import { onIdleCallback } from "../util/onIdleCallback";
import { getCurrentCulture, pushCulture, popCulture, CultureInfo, ResolvedCultureInfo } from "./Culture";
import { View } from "../data/View";
import { Config } from "./Prop";

// On by default. Once a synchronous update burst grows deep, Cx starts issuing updates from microtasks
// so React's global nested-update counter resets before continuing -- preventing "Maximum update depth
// exceeded" on large renders that write to the store while they render (e.g. a several-hundred-page
// report). For updates that settle in a single render -- virtually all of them -- this is equivalent to
// rendering synchronously; it only diverges under a deep re-entrant render burst. If you suspect it
// causes trouble, opt out at app startup with disableSyncUpdateCoalescing() -- and please report the
// issue so it can be fixed.

// Synchronous updates allowed within one burst before Cx switches to issuing updates from a microtask.
// Kept under React's ~50 nested-update limit (which is global to the root, not per component); the
// default trades a little initial-render time for a safety margin. Override via
// enableSyncUpdateCoalescing(limit) if needed.
const defaultSyncBurstLimit = 35;
let syncBurstLimit = defaultSyncBurstLimit;

// Microtask-issued updates allowed within one burst before Cx escalates to setTimeout. Deep enough that
// only a store that never converges reaches it; timeouts let the event loop turn, so the page stays
// responsive and batchUpdatesAndNotify fallback timers can fire instead of the tab hanging.
let microtaskBurstLimit = 1000;

export function enableSyncUpdateCoalescing(limit?: number): void {
   syncBurstLimit = limit ?? defaultSyncBurstLimit;
}
export function disableSyncUpdateCoalescing(): void {
   syncBurstLimit = Infinity;
}

// Module-global because React's nested-update limit is global to the root, not per component. The burst
// counter resets only when all notifications settle (see completeNotification) -- tying the burst
// window to unsettled work makes it immune to how React schedules the flushes. Legacy React chains
// re-entrant updates synchronously within one task, but React 19 may run each round from its own
// microtask, so no task/microtask boundary is a reliable reset point.
let syncBurstRounds = 0; // updates issued in the current burst
let outstandingNotifications = 0; // reported notifications not yet rendered, across all Cx instances

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
   error?: boolean;
}

export class Cx extends VDOM.Component<CxProps, CxState> {
   widget: Widget;
   store: View;
   parentInstance?: Instance;
   instance?: Instance;
   flags: { preparing?: boolean; dirty?: boolean; rendering?: boolean };
   renderCount: number;
   unsubscribe?: () => void;
   forceUpdateCallback: () => void;
   deferCounter: number;
   pendingUpdateTimer?: NodeJS.Timeout;
   unsubscribeIdleRequest?: () => void;
   // store notifications reported to batchUpdatesAndNotify subscribers but not yet rendered and completed
   owedNotifications: Set<number> = new Set();
   // setState is not allowed before the component mounts; pre-mount notifications set flags.dirty instead
   // and componentDidMount picks them up (see update())
   mounted: boolean = false;
   // true once this instance has contributed to syncBurstRounds for the current render round; cleared on
   // render, so bursts are counted per round rather than per notification (see update())
   burstRoundCounted: boolean = false;

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

      this.flags = {};
      this.renderCount = 0;

      this.forceUpdateCallback = this.forceUpdate.bind(this);

      // deferredUntilIdle content stays hidden until the idle callback scheduled on mount bumps the token
      this.deferCounter = props.deferredUntilIdle ? 1 : 0;
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
      this.burstRoundCounted = false;

      // an error was captured and is being dispatched to the onError callback (see componentDidCatch);
      // render nothing until the callback repairs the state
      if (this.state.error) return null;

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
      this.mounted = true;
      // schedule the deferredUntilIdle reveal here rather than in the constructor -- the idle callback
      // could otherwise fire before the component mounts and issue a setState React does not allow yet
      this.waitForIdle();
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
      if (this.flags.preparing || !this.mounted) this.flags.dirty = true;
      // Synchronous path: while batching (incl. batchUpdatesAndNotify, which page-breaking relies on) or for
      // `immediate` instances.
      else if (this.props.immediate || isBatchingUpdates()) {
         // Every notification is reported to batchUpdatesAndNotify subscribers up front and completed only
         // once the setState that renders it commits, so notify callbacks never fire before the DOM reflects
         // the change. Each notification always gets its own setState; only its timing escalates as the
         // burst grows: synchronous at first, then from a microtask (lets React's commit finish so its
         // global nested-update counter resets instead of tripping "Maximum update depth exceeded"), and
         // finally from a timeout (lets the event loop turn, so a store that never converges degrades to a
         // responsive page instead of a frozen tab).
         let seq = notifyBatchedUpdateStarting();
         this.owedNotifications.add(seq);
         outstandingNotifications++;
         // Count render rounds rather than notifications: only the first notification an instance
         // receives per render round bumps the shared depth (the flag clears on render). This tracks
         // React's nested-commit count -- the thing the escalation must stay under -- so a round that
         // writes many values doesn't burn through the budget in one go.
         if (!this.burstRoundCounted) {
            this.burstRoundCounted = true;
            ++syncBurstRounds;
            if (process.env.NODE_ENV !== "production" && syncBurstRounds === microtaskBurstLimit + 1)
               console.error(
                  "Cx: store updates are not converging after " +
                     microtaskBurstLimit +
                     " render rounds -- possible update loop. Updates are now issued from timeouts to keep the page responsive. Look for code that writes a new value to the store on every render.",
               );
         }
         if (syncBurstRounds <= syncBurstLimit) this.issueStateUpdate(seq);
         else if (syncBurstRounds <= microtaskBurstLimit) queueMicrotask(() => this.issueStateUpdate(seq));
         else setTimeout(() => this.issueStateUpdate(seq), 0);
      } else {
         // standard mode: coalesce sequential store commands into a single deferred update
         this.scheduleStateUpdate();
      }
   }

   // Render the latest store data and report the notification completed once the commit is done, so
   // batchUpdatesAndNotify resolves only when the DOM reflects the store.
   issueStateUpdate(seq: number): void {
      // skip notifications no longer owed -- unmount may have already released them
      if (!this.owedNotifications.has(seq)) return;
      this.setState({ data: this.store.getData() }, () => this.completeNotification(seq));
   }

   completeNotification(seq: number): void {
      // skip notifications no longer owed -- unmount may have already released them
      if (!this.owedNotifications.delete(seq)) return;
      outstandingNotifications--;
      notifyBatchedUpdateCompleted(seq);
      // everything settled -- the next burst starts fresh, and so does React's nested-update counter
      // (the commit that settled the last notification ends without scheduling further synchronous work)
      if (outstandingNotifications === 0) syncBurstRounds = 0;
   }

   scheduleStateUpdate() {
      if (!this.pendingUpdateTimer) {
         let seq = notifyBatchedUpdateStarting();
         this.owedNotifications.add(seq);
         outstandingNotifications++;
         this.pendingUpdateTimer = setTimeout(() => {
            delete this.pendingUpdateTimer;
            // read fresh data at fire time so the coalesced update renders the latest store state
            this.setState({ data: this.store.getData() }, () => this.completeNotification(seq));
         }, 0);
      }
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
      // Release notifications that will never render so a waiting batchUpdatesAndNotify can settle instead
      // of waiting out its fallback timeout.
      for (let seq of this.owedNotifications) this.completeNotification(seq);
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

   // Render null for the failed subtree while the error is dispatched to componentDidCatch below --
   // returning a state update here is what React expects of an error boundary (rendering the broken
   // children again would just rethrow).
   static getDerivedStateFromError(): Partial<CxState> {
      return { error: true };
   }

   componentDidCatch(error: Error, info: any): void {
      this.flags.preparing = false;
      // without an onError callback this instance is not an error boundary -- rethrow so the error
      // reaches the nearest ancestor boundary, matching the behavior before getDerivedStateFromError
      // was introduced
      if (!this.props.onError) throw error;
      this.props.onError(error, this.getInstance(), info);
      // the callback had a chance to repair the state (e.g. replace the failing content) -- resume rendering
      this.setState({ error: false });
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
