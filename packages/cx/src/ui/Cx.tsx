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
import { getCurrentCulture, pushCulture, popCulture, CultureInfo } from "./Culture";
import { View } from "../data/View";
import * as CxCore from "../core";

export interface CxProps {
   widget?: CxCore.Config;
   items?: CxCore.Config;
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
   cultureInfo?: CultureInfo;
}

export interface CxState {
   deferToken: number;
   data?: any;
}

export class Cx extends VDOM.Component<CxProps, CxState> {
   widget: typeof Widget;
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
            this.parentInstance = new Instance(this.widget, 0, null, props.store);
            this.store = props.store;
         }

         if (!this.store) throw new Error("Cx component requires a store.");
      }

      this.state = {
         deferToken: 0,
      };

      if (props.subscribe) {
         this.unsubscribe = this.store.subscribe(this.update.bind(this));
         (this.state as any).data = this.store.getData();
      }

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

      if (this.instance && (this.instance as any).widget === this.widget) {
         if ((this.instance as any).parentStore != this.store) (this.instance as any).setParentStore(this.store);
         return this.instance;
      }

      if (this.widget && this.parentInstance)
         return (this.instance = (this.parentInstance as any).getDetachedChild(this.widget, 0, this.store));

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
      else if (isBatchingUpdates() || this.props.immediate) {
         notifyBatchedUpdateStarting();
         this.setState({ data: data }, notifyBatchedUpdateCompleted);
      } else {
         //in standard mode sequential store commands are batched
         if (!this.pendingUpdateTimer) {
            notifyBatchedUpdateStarting();
            this.pendingUpdateTimer = setTimeout(() => {
               delete this.pendingUpdateTimer;
               this.setState({ data: data }, notifyBatchedUpdateCompleted);
            }, 0);
         }
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
   cultureInfo?: CultureInfo;
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

      if (this.props.instance !== instance && (this.props.instance as any).destroyTracked) (this.props.instance as any).destroy();

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

               for (let i = 0; i < (context as any).prepareList.length; i++) (context as any).prepareList[i].prepare(context);
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
            for (let i = 0; i < (context as any).cleanupList.length; i++) (context as any).cleanupList[i].cleanup(context);
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
