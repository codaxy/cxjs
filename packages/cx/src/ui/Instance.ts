import { isAccessorChain } from "../data/createAccessorModelProxy";
import { View } from "../data/View";
import { debug, destroyFlag, processDataFlag, renderFlag } from "../util/Debug";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";
import { isArray } from "../util/isArray";
import { isDefined } from "../util/isDefined";
import { isFunction } from "../util/isFunction";
import { isNonEmptyArray } from "../util/isNonEmptyArray";
import { isObject } from "../util/isObject";
import { isString } from "../util/isString";
import { isUndefined } from "../util/isUndefined";
import { throttle } from "../util/throttle";
import { validatedDebounce } from "../util/validatedDebounce";
import { batchUpdates } from "./batchUpdates";
import { Controller } from "./Controller";
import { RenderingContext } from "./RenderingContext";
import type { Widget } from "./Widget";

/**
 * Serializable value types that can be safely passed through the framework
 */
export type SerializableValue = string | number | boolean | object | null | undefined;

/**
 * Core instance data structure used by widgets
 *
 * For custom widget data, extend this interface:
 * @example
 * interface MyWidgetData extends WidgetData {
 *    customProp: string;
 * }
 */
export interface WidgetData {
   visible?: boolean;
   disabled?: boolean;
   enabled?: boolean;
   text?: string;
   innerHtml?: string;
   attrs?: Record<string, unknown>;
   data?: Record<string, unknown>;
   classNames?: string;
   className?: string;
   class?: string;
   style?: Record<string, string | number> | string;
   stateMods?: Record<string, boolean | undefined>;
   mod?: Record<string, boolean | undefined>;
   pressed?: boolean;
   icon?: string | boolean;
   confirm?: string | ConfirmConfig;
   parentDisabled?: boolean;
   parentStrict?: boolean;
   error?: string;
}

/**
 * Confirmation dialog configuration
 */
export interface ConfirmConfig {
   message: string;
   title?: string;
   yesText?: string;
   noText?: string;
}

/**
 * Parent options passed down from overlay/modal components
 *
 * For custom parent options, extend this interface:
 * @example
 * interface MyParentOptions extends ParentOptions {
 *    customOption: string;
 * }
 */
export interface ParentOptions {
   dismiss?: () => void;
}

/**
 * Props object used for rendering (passed to React.createElement)
 */
export type RenderProps = Record<string, any>;

/**
 * Result type for yes/no dialogs
 */
export const enum YesNoResult {
   Yes = "yes",
   No = "no",
}

/**
 * Partial instance-like object used in some render methods
 * This is a hack to allow passing only the data property instead of full Instance
 */
export interface PartialInstance {
   data: Record<string, any>;
   widget?: Widget;
   state?: Record<string, any>;
}

/**
 * Example widget-specific properties for dropdown widgets
 */
export interface DropdownWidgetProps {
   lastDropdown?: Instance;
   dropdownOpen?: boolean;
   selectedIndex?: number;
}

/**
 * Example widget-specific properties for form field widgets
 */
export interface FieldWidgetProps {
   inputElement?: HTMLInputElement;
   validationState?: "valid" | "invalid" | "pending";
}

/**
 * Type aliases for common widget instance types using intersection types
 */
export type DropdownInstance = Instance & DropdownWidgetProps;
export type FieldInstance = Instance & FieldWidgetProps;

let instanceId = 1000;

/**
 * Base Instance class
 */
export class Instance<WidgetType extends Widget<any, any> = Widget<any, any>> {
   // Core properties
   declare public widget: WidgetType;
   declare public key: string;
   declare public id: string;
   declare public parent?: Instance;
   declare public parentStore: View;
   declare public store: View;
   declare public controller?: Controller;

   // Data and state
   declare public data: Record<string, any>;
   declare public rawData: Record<string, any>;
   declare public state?: Record<string, any>;
   declare public cached: Record<string, any>;
   declare public cacheList?: Record<string, any> | null;

   // Selectors
   public dataSelector?: (store: any) => Record<string, any>;

   // Lifecycle flags
   public initialized?: boolean;
   declare public visible?: boolean;
   declare public explored?: boolean;
   declare public prepared?: boolean;
   declare public shouldUpdate?: boolean;
   declare public childStateDirty?: boolean;
   declare public detached?: boolean;

   // Cleanup tracking
   declare public needsExploreCleanup?: boolean;
   declare public needsPrepare?: boolean;
   declare public needsCleanup?: boolean;
   declare public destroyTracked?: boolean;
   public destroySubscriptions?: Array<() => void> | null;

   // Child management
   declare public instanceCache?: InstanceCache | null;
   declare public children?: Instance[];
   public helpers?: Record<string, Instance>;
   public components?: Record<string, Instance>;

   // Rendering
   declare public vdom?: any;
   declare public contentVDOM?: any;
   declare public renderList?: any;
   declare public assignedRenderList?: any;

   // Layout
   declare public outerLayout?: Instance;
   declare public contentPlaceholder?: any;
   declare public parentOptions?: any;

   // Setters
   declare public setters?: Record<string, any>;

   // Other
   declare public record?: any;
   declare public mappedRecords?: any[];

   // List-specific
   declare public instances?: Instance[];
   declare public selected?: boolean;

   constructor(widget: WidgetType, key: string, parent?: Instance, parentStore?: any) {
      this.widget = widget;
      this.key = key;
      this.id = String(++instanceId);
      this.cached = {};
      this.parent = parent;
      this.parentStore = parentStore ?? parent?.store;

      if (this.parentStore == null) throw new Error("Cannot create instance without a parent store.");
   }

   public setParentStore(parentStore: any): void {
      this.parentStore = parentStore;
      this.widget.applyParentStore(this);
   }

   public init(context: RenderingContext): void {
      // widget is initialized when the first instance is initialized
      if (!this.widget.initialized) {
         this.widget.init();
         this.widget.initialized = true;
      }

      if (!this.dataSelector) {
         this.widget.selector!.init(this.parentStore);
         this.dataSelector = this.widget.selector!.createStoreSelector();
      }

      // init instance might change the store, so this must go before the controller initialization
      this.widget.initInstance(context, this);

      // initInstance can set the store, otherwise use parent store
      if (!this.store) this.store = this.parentStore;
      if (this.widget.onInit) this.widget.onInit(context, this);

      this.widget.initState(context, this);

      if (this.widget.controller)
         this.controller = Controller.create(this.widget.controller, {
            widget: this.widget,
            instance: this,
            store: this.store,
         });

      if (
         this.widget.exploreCleanup ||
         this.widget.outerLayout ||
         this.widget.isContent ||
         this.widget.controller ||
         this.widget.prepareCleanup
      )
         this.needsExploreCleanup = true;
      if (this.widget.prepare || this.widget.controller) this.needsPrepare = true;
      if (this.widget.cleanup || this.widget.controller) this.needsCleanup = true;
      this.initialized = true;
   }

   public checkVisible(context: RenderingContext): boolean {
      if (!this.initialized) this.init(context);

      const wasVisible = this.visible;
      this.rawData = this.dataSelector!(this.store);
      this.visible = this.widget.checkVisible(context, this, this.rawData);
      if (this.visible && !this.detached) this.parent!.instanceCache!.addChild(this);
      this.explored = false;
      this.prepared = false;

      if (!this.visible && wasVisible) this.destroy();

      return this.visible;
   }

   public scheduleExploreIfVisible(context: RenderingContext): boolean {
      if (this.checkVisible(context)) {
         context.exploreStack.push(this);

         if (this.needsExploreCleanup) context.exploreStack.push(this);

         return true;
      }
      return false;
   }

   public cache(key: string, value: any): boolean {
      const oldValue = this.cached[key];
      if (oldValue === value) return false;

      if (!this.cacheList) this.cacheList = {};
      this.cacheList[key] = value;
      return true;
   }

   public markShouldUpdate(context: RenderingContext): void {
      let ins: Instance | undefined = this;
      let renderList = this.renderList;
      renderList.markReverseIndex();

      //notify all parents that child state changed to bust up caching
      while (ins && !ins.shouldUpdate && ins.explored) {
         if (ins.renderList !== renderList) {
            renderList.reverse();
            renderList = ins.renderList;
            renderList.markReverseIndex();
         }
         ins.shouldUpdate = true;
         renderList.data.push(ins);
         ins = ins.widget.isContent
            ? ins.contentPlaceholder
            : ins.parent?.outerLayout === ins
              ? ins.parent?.parent
              : ins.parent;
      }
      renderList.reverse();
   }

   public explore(context: RenderingContext): void {
      if (!this.visible) throw new Error("Explore invisible!");

      if (this.explored) {
         if (this.widget.prepareCleanup) context.prepareList.push(this);

         if (this.widget.exploreCleanup) this.widget.exploreCleanup(context, this);

         if (this.parent?.outerLayout === this) context.popNamedValue("content", "body");

         if (this.widget.controller) context.pop("controller");

         return;
      }

      this.explored = true;

      if (this.needsPrepare) context.prepareList.push(this);
      else this.prepared = true;

      if (this.needsCleanup) context.cleanupList.push(this);

      if (this.instanceCache) this.instanceCache.mark();

      //controller may reconfigure the widget and need to go before shouldUpdate calculation
      this.parentOptions = context.parentOptions;

      if (!this.controller) {
         if (context.controller) this.controller = context.controller;
         else if (this.parent?.controller) this.controller = this.parent?.controller;
      }

      this.destroyTracked = false;

      if (this.controller) {
         if (this.widget.controller) {
            if (!this.controller.initialized) {
               this.controller.init(context);
               this.controller.initialized = true;
            }
            context.push("controller", this.controller);
            this.controller.explore(context);
            if (this.controller.onDestroy && this.controller.widget == this.widget) this.trackDestroy();
         }
      }

      if (this.widget.onDestroy || isNonEmptyArray(this.destroySubscriptions)) this.trackDestroy();

      this.renderList = this.assignedRenderList || this.parent?.renderList || context.getRootRenderList();

      let shouldUpdate =
         this.rawData !== this.cached.rawData ||
         this.state !== this.cached.state ||
         this.widget.version !== this.cached.widgetVersion ||
         this.cached.globalCacheIdentifier !== GlobalCacheIdentifier.get();

      if (shouldUpdate) {
         this.data = { ...this.rawData };
         this.widget.prepareData(context, this);
         debug(processDataFlag, this.widget);
      }

      //onExplore might set the outer layout
      if (this.widget.onExplore) this.widget.onExplore(context, this);

      if (this.parent?.outerLayout === this) {
         this.renderList = this.renderList.insertRight();
         context.pushNamedValue("content", "body", this.parent);
      }

      if (this.widget.outerLayout) {
         this.outerLayout = this.getChild(context, this.widget.outerLayout, null, this.store);
         this.outerLayout.scheduleExploreIfVisible(context);
         this.renderList = this.renderList.insertLeft();
      }

      if (this.widget.isContent) {
         this.contentPlaceholder = context.contentPlaceholder && context.contentPlaceholder[this.widget.putInto!];
         if (this.contentPlaceholder) context.contentPlaceholder[this.widget.putInto!](this);
         else {
            this.renderList = this.renderList.insertLeft();
            context.pushNamedValue("content", this.widget.putInto!, this);
            if (!context.contentList) context.contentList = {};
            let list = context.contentList[this.widget.putInto!];
            if (!list) list = context.contentList[this.widget.putInto!] = [];
            list.push(this);
         }
      }

      this.shouldUpdate = false;
      if (shouldUpdate || this.childStateDirty || !this.widget.memoize) this.markShouldUpdate(context);

      context.exploreStack.hop();

      if (this.widget.helpers) {
         this.helpers = {};
         for (let cmp in this.widget.helpers) {
            let helper = this.widget.helpers[cmp];
            if (helper) {
               let ins = this.getChild(context, helper);
               if (ins.scheduleExploreIfVisible(context)) this.helpers[cmp] = ins;
            }
         }
      }

      //TODO: check do we need to pass data here?
      this.widget.explore(context, this, this.data);
   }

   public prepare(context: RenderingContext): void {
      if (!this.visible) throw new Error("Prepare invisible!");

      if (this.prepared) {
         if (this.widget.prepareCleanup) this.widget.prepareCleanup(context, this);
         return;
      }

      this.prepared = true;
      if (this.widget.prepare) this.widget.prepare(context, this);

      if (this.widget.controller && this.controller?.prepare) this.controller.prepare(context);
   }

   public render(context: RenderingContext): null | Record<string, React.ReactNode> | React.ReactNode[] {
      if (!this.visible) throw new Error("Render invisible!");

      if (this.shouldUpdate) {
         debug(renderFlag, this.widget, this.key);
         const vdom = renderResultFix(this.widget.render(context, this, this.key));
         if (this.widget.isContent || this.outerLayout) this.contentVDOM = vdom;
         else this.vdom = vdom;
      }

      if (this.cacheList) {
         for (const key in this.cacheList) {
            this.cached[key] = this.cacheList[key];
         }
      }

      this.cacheList = null;

      this.cached.rawData = this.rawData;
      this.cached.data = this.data;
      this.cached.state = this.state;
      this.cached.widgetVersion = this.widget.version;
      this.cached.globalCacheIdentifier = GlobalCacheIdentifier.get();
      this.childStateDirty = false;

      if (this.instanceCache) this.instanceCache.sweep();

      if (this.parent?.outerLayout === this) {
         //if outer layouts are chained we need to find the originating element (last element with OL set)
         let parent = this.parent;
         while (parent.parent?.outerLayout == parent) parent = parent.parent;
         parent.vdom = this.vdom;
      }

      return this.vdom;
   }

   public cleanup(context: RenderingContext): void {
      if (this.widget.controller && this.controller?.cleanup) this.controller.cleanup(context);

      if (this.widget.cleanup) this.widget.cleanup(context, this);
   }

   private trackDestroy(): void {
      if (!this.destroyTracked) {
         this.destroyTracked = true;
         if (this.parent && !this.detached) this.parent.trackDestroyableChild(this);
      }
   }

   private trackDestroyableChild(child: Instance): void {
      this.instanceCache!.trackDestroy(child);
      this.trackDestroy();
   }

   public subscribeOnDestroy(callback: () => void): () => void {
      if (!this.destroySubscriptions) this.destroySubscriptions = [];
      this.destroySubscriptions.push(callback);
      this.trackDestroy();
      return () => {
         if (this.destroySubscriptions) {
            this.destroySubscriptions = this.destroySubscriptions.filter((cb) => cb !== callback);
         }
      };
   }

   public destroy(): void {
      if (this.instanceCache) {
         this.instanceCache.destroy();
         this.instanceCache = null;
      }

      if (this.destroySubscriptions) {
         this.destroySubscriptions.forEach((cb) => cb());
         this.destroySubscriptions = null;
      }

      if (this.destroyTracked) {
         debug(destroyFlag, this);

         if (this.widget.onDestroy) this.widget.onDestroy(this);

         if (
            this.widget.controller &&
            this.controller &&
            this.controller.onDestroy &&
            this.controller.widget == this.widget
         )
            this.controller.onDestroy();

         this.destroyTracked = false;
      }
   }

   public setState(state: Record<string, any>): void {
      let skip = !!this.state;
      if (this.state) {
         for (const k in state) {
            if (this.state[k] !== state[k]) {
               skip = false;
               break;
            }
         }
      }

      if (skip) return;

      this.state = Object.assign({}, this.state, state);
      let parent = this.parent;
      //notify all parents that child state change to bust up caching
      while (parent) {
         parent.childStateDirty = true;
         parent = parent.parent;
      }
      batchUpdates(() => {
         this.store.notify();
      });
   }

   public set(prop: string, value: any, options: { internal?: boolean; immediate?: boolean } = {}): boolean {
      //skip re-rendering (used for reading state from uncontrolled components)
      if (options.internal && this.rawData) {
         this.rawData[prop] = value;
         this.data[prop] = value;
      }

      const setter = this.setters && this.setters[prop];
      if (setter) {
         if (options.immediate && isFunction(setter.reset)) setter.reset(value);
         else setter(value);
         return true;
      }

      const p = (this.widget as any)[prop];
      if (p && typeof p == "object") {
         if (p.debounce) {
            this.definePropertySetter(
               prop,
               validatedDebounce(
                  (value: any) => this.doSet(prop, value),
                  () => this.dataSelector!(this.store)[prop],
                  p.debounce,
               ),
            );
            this.set(prop, value, options);
            return true;
         }

         if (p.throttle) {
            this.definePropertySetter(
               prop,
               throttle((value: any) => this.doSet(prop, value), p.throttle),
            );
            this.set(prop, value, options);
            return true;
         }
      }

      return this.doSet(prop, value);
   }

   public definePropertySetter(prop: string, setter: any): void {
      if (!this.setters) this.setters = {};
      this.setters[prop] = setter;
   }

   protected doSet(prop: string, value: any): boolean {
      let changed = false;
      batchUpdates(() => {
         const p = (this.widget as any)[prop];
         if (isObject(p)) {
            const pObj = p as any;
            if (pObj.set) {
               if (isFunction(pObj.set)) {
                  pObj.set(value, this);
                  changed = true;
               } else if (isString(pObj.set)) {
                  (this.controller as any)?.[pObj.set](value, this);
                  changed = true;
               }
            } else if (pObj.action) {
               const action = pObj.action(value, this);
               this.store.dispatch(action);
               changed = true;
            } else if (isString(pObj.bind) || isAccessorChain(pObj.bind)) {
               changed = this.store.set(pObj.bind, value);
            }
         } else if (isAccessorChain(p)) {
            changed = this.store.set(p.toString(), value);
         }
      });
      return changed;
   }

   public nestedDataSet(key: string, value: any, dataConfig: Record<string, any>, useParentStore?: boolean): boolean {
      let config = dataConfig[key];
      if (!config)
         throw new Error(`Unknown nested data key ${key}. Known keys are ${Object.keys(dataConfig).join(", ")}.`);

      if (isAccessorChain(config)) config = { bind: config.toString() };

      if (config.bind) {
         let store = this.store;
         //in case of Rescope or DataProxy, bindings point to the data in the parent store
         if (useParentStore && store.store) store = store.store;
         return isUndefined(value) ? store.deleteItem(config.bind) : store.setItem(config.bind, value);
      }

      if (!config.set)
         throw new Error(
            `Cannot change nested data value for ${key} as it's read-only. Either define it as a binding or define a set function.`,
         );
      if (isString(config.set)) this.getControllerMethod(config.set)(value, this);
      else if (isFunction(config.set)) config.set(value, this);
      else
         throw new Error(
            `Cannot change nested data value for ${key} the defined setter is neither a function nor a controller method.`,
         );

      return true;
   }

   public replaceState(state: Record<string, any>): void {
      this.cached.state = this.state;
      this.state = state;
      this.store.notify();
   }

   public getInstanceCache(): InstanceCache {
      if (!this.instanceCache)
         this.instanceCache = new InstanceCache(this, this.widget.isPureContainer ? this.key : null);
      return this.instanceCache;
   }

   public clearChildrenCache(): void {
      if (this.instanceCache) this.instanceCache.destroy();
   }

   public getChild(
      context: RenderingContext | null,
      widget: Widget,
      key?: string | number | null,
      store?: any,
   ): Instance {
      return this.getInstanceCache().getChild(widget, store ?? this.store, key);
   }

   public getDetachedChild(widget: Widget, key: string, store?: any): Instance {
      const child = new Instance(widget, key, this, store ?? this.store);
      child.detached = true;
      return child;
   }

   public prepareRenderCleanupChild(widget: any, store?: any, keyPrefix?: string, options?: any): any {
      return widget.prepareRenderCleanup(store ?? this.store, options, keyPrefix, this);
   }

   public getJsxEventProps(): Record<string, any> | null {
      const { widget } = this;

      if (!isArray(widget.jsxAttributes)) return null;

      const props: Record<string, any> = {};
      widget.jsxAttributes.forEach((attr) => {
         if (attr.indexOf("on") == 0 && attr.length > 2) {
            props[attr] = (e: any) => this.invoke(attr, e, this);
         }
      });
      return props;
   }

   public getCallback(methodName: string): (...args: any[]) => any {
      const scope = this.widget as any;
      const callback = scope[methodName];

      if (typeof callback === "string") return this.getControllerMethod(callback);

      if (typeof callback !== "function")
         throw new Error(`Cannot invoke callback method ${methodName} as assigned value is not a function.`);

      return callback.bind(scope);
   }

   /**
    * Finds the first controller in the instance tree matching the predicate
    * @param predicate Function to test each controller
    * @returns The matching controller or undefined
    */
   public findController(predicate: (controller: Controller) => boolean): Controller | undefined {
      let at: Instance | undefined = this;
      while (at?.controller != null) {
         if (predicate(at.controller)) {
            return at.controller;
         }
         at = at.parent;
      }
      return undefined;
   }

   /**
    * Finds a controller of the specified type in the instance tree
    * @param type Controller class/constructor to find
    * @returns The matching controller cast to the specified type, or undefined
    */
   public findControllerByType<T extends Controller>(type: new (...args: any[]) => T): T | undefined {
      return this.findController((c) => c instanceof type) as T | undefined;
   }

   /**
    * Gets the first controller in the instance tree matching the predicate
    * @param predicate Function to test each controller
    * @returns The matching controller
    * @throws Error if no matching controller is found
    */
   public getController(predicate: (controller: Controller) => boolean): Controller {
      const controller = this.findController(predicate);
      if (!controller) throw new Error("Cannot find a controller matching the given predicate in the instance tree.");
      return controller;
   }

   /**
    * Gets a controller of the specified type in the instance tree
    * @param type Controller class/constructor to find
    * @returns The matching controller cast to the specified type
    * @throws Error if no controller of the specified type is found
    */
   public getControllerByType<T extends Controller>(type: new (...args: any[]) => T): T {
      const controller = this.findControllerByType(type);
      if (!controller) throw new Error(`Cannot find a controller of type "${type.name}" in the instance tree.`);
      return controller;
   }

   public getControllerMethod(methodName: string): (...args: any[]) => any {
      if (!this.controller)
         throw new Error(
            `Cannot invoke controller method "${methodName}" as controller is not assigned to the widget.`,
         );

      const controller = this.findController((c) => !!(c as any)[methodName]);

      if (!controller)
         throw new Error(
            `Cannot invoke controller method "${methodName}". The method cannot be found in any of the assigned controllers.`,
         );

      return (controller as any)[methodName].bind(controller);
   }

   public invoke(methodName: string, ...args: any[]): any {
      return this.getCallback(methodName).apply(null, args);
   }

   public invokeControllerMethod(methodName: string, ...args: any[]): any {
      return this.getControllerMethod(methodName).apply(null, args);
   }
}

function renderResultFix(res: any): any {
   return res != null && isDefined(res.content) ? res : { content: res };
}

export class InstanceCache {
   declare public children: Record<string, Instance>;
   declare public parent: Instance;
   declare public marked: Record<string, Instance>;
   declare public monitored: Record<string, Instance> | null;
   declare public keyPrefix: string;

   constructor(parent: Instance, keyPrefix?: string | number | null) {
      this.children = {};
      this.parent = parent;
      this.marked = {};
      this.monitored = null;
      this.keyPrefix = keyPrefix != null ? keyPrefix + "-" : "";
   }

   public getChild(widget: Widget, parentStore: any, key?: string | number | null): Instance {
      const k = this.keyPrefix + (key != null ? key : widget.vdomKey || widget.widgetId);
      let instance = this.children[k];

      if (
         !instance ||
         instance.widget !== widget ||
         (!instance.visible && (instance.widget.controller || instance.widget.onInit))
      ) {
         instance = new Instance(widget, k, this.parent, parentStore);
         this.children[k] = instance;
      } else if (instance.parentStore !== parentStore) {
         instance.setParentStore(parentStore);
      }

      return instance;
   }

   public addChild(instance: Instance): void {
      this.marked[instance.key] = instance;
   }

   public mark(): void {
      this.marked = {};
   }

   public trackDestroy(instance: Instance): void {
      if (!this.monitored) this.monitored = {};
      this.monitored[instance.key as string] = instance;
   }

   public destroy(): void {
      this.children = {};
      this.marked = {};

      if (!this.monitored) return;

      for (const key in this.monitored) {
         this.monitored[key].destroy();
      }

      this.monitored = null;
   }

   public sweep(): void {
      this.children = this.marked;
      if (!this.monitored) return;
      let activeCount = 0;
      for (const key in this.monitored) {
         const monitoredChild = this.monitored[key];
         const child = this.children[key];
         if (child !== monitoredChild || !monitoredChild.visible) {
            monitoredChild.destroy();
            delete this.monitored[key];
            if (child === monitoredChild) delete this.children[key];
         } else activeCount++;
      }
      if (activeCount === 0) this.monitored = null;
   }
}
