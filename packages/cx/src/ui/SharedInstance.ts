import type { View } from "../data/View";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";
import { ContainerBase } from "./Container";
import { ChildState } from "./ChildState";
import { Instance, renderResultFix } from "./Instance";
import type { RenderingContext } from "./RenderingContext";
import type { Widget } from "./Widget";

/**
 * Whether an initialized widget is rendered through the shared instance, without an instance of its own.
 * That takes a widget that allows it (see `Widget.canShareInstance`) and has none of the hooks that need an instance
 * of its own.
 */
export function canUseSharedInstance(widget: Widget): boolean {
   return (
      widget.canShareInstance() &&
      !widget.controller &&
      !widget.onInit &&
      !widget.onExplore &&
      !widget.onPrepare &&
      !widget.onCleanup &&
      !widget.onDestroy &&
      !widget.outerLayout &&
      !widget.isContent &&
      !widget.helpers &&
      !widget.components &&
      !widget.prepare &&
      !widget.cleanup &&
      !widget.exploreCleanup &&
      !widget.prepareCleanup
   );
}

/**
 * Whether the widget is rendered through the shared instance, decided once, the first time it is asked, and kept
 * in `widget.sharesInstance`. The decision depends on the widget's configuration, so the widget is initialized first if
 * needed, rather than with its first instance as usual. It is keyed on the decision, not on initialization, because
 * a widget may already be initialized elsewhere, e.g. by Container.find or by an instance created directly with
 * getChild, and would otherwise never share the instance.
 */
export function sharesInstance(widget: Widget): boolean {
   if (widget.sharesInstance === undefined) {
      if (!widget.initialized) {
         widget.init();
         widget.initialized = true;
      }
      widget.sharesInstance = canUseSharedInstance(widget);
   }
   return widget.sharesInstance;
}

const SHARED_INSTANCE_ID = "shared-instance";

const noChildren: ChildState[] = [];

let shared: Instance | null = null;

/** Whether the instance is a shared instance, which must not be kept after the widget renders. */
export function isSharedInstance(instance: Instance): boolean {
   return instance.id === SHARED_INSTANCE_ID;
}

/**
 * The shared instance for children of `parent`, to update them with `exploreChildState`. Release it with
 * `releaseSharedInstance` when done.
 */
export function acquireSharedInstance(parent: Instance, store: View): Instance {
   // the shared one, unless it is in use
   let instance = shared && !shared.parent ? shared : createSharedInstance();
   if (!shared) shared = instance;
   instance.parent = parent;
   instance.parentStore = instance.store = store;
   return instance;
}

export function releaseSharedInstance(instance: Instance): void {
   // nothing of the widgets is kept; the fields are unset only while the shared instance is not in use
   let released: Partial<Instance> = instance;
   released.widget = released.parent = released.parentStore = released.store = undefined;
   released.rawData = released.data = released.cached = released.children = undefined;
}

/**
 * Updates the state of a child rendered through the shared instance, as Instance.checkVisible, Instance.explore
 * and Instance.render would update an instance of its own. The widget's methods get the shared instance with the
 * state loaded. The items of a container, which share the instance too (see HtmlElement), are updated first, and
 * the container is rendered from them. Returns true if the child became visible or hidden, or rendered again.
 */
export function exploreChildState(context: RenderingContext, instance: Instance, state: ChildState): boolean {
   let { widget } = state;
   instance.widget = widget;
   instance.key = state.key;
   let rawData = (instance.rawData = state.dataSelector(instance.store));
   let changed = false;
   let visible = widget.checkVisible(context, instance, rawData);
   if (visible !== state.visible) {
      state.visible = visible;
      changed = true;
   }
   if (!visible) return changed;

   let items = widget instanceof ContainerBase ? widget.items : undefined;
   let itemStates = state.itemStates;
   let itemsChanged = false;
   if (items && items.length > 0) {
      if (!itemStates) {
         itemStates = state.itemStates = [];
         for (let item of items)
            itemStates.push(ChildState.create(item, String(item.vdomKey || item.widgetId), instance.store));
      }
      for (let i = 0; i < itemStates.length; i++)
         if (exploreChildState(context, instance, itemStates[i])) itemsChanged = true;
      // the items were loaded in the meantime
      instance.widget = widget;
      instance.key = state.key;
      instance.rawData = rawData;
   }

   let globalCacheIdentifier = GlobalCacheIdentifier.get();
   let dataChanged =
      rawData !== state.rawData ||
      globalCacheIdentifier !== state.globalCacheIdentifier ||
      widget.version !== state.widgetVersion ||
      !widget.memoize;

   if (dataChanged || itemsChanged) {
      instance.cached = {};
      if (dataChanged) {
         instance.data = { ...rawData };
         widget.prepareData(context, instance);
      } else instance.data = state.data;
      // the visible items, which Container.renderChildren renders from
      let children = noChildren;
      if (itemStates) {
         children = [];
         for (let i = 0; i < itemStates.length; i++) if (itemStates[i].visible) children.push(itemStates[i]);
      }
      instance.children = children;
      state.vdom = renderResultFix(widget.render(context, instance, state.key));
      instance.children = undefined;
      state.rawData = rawData;
      state.data = instance.data;
      state.globalCacheIdentifier = globalCacheIdentifier;
      state.widgetVersion = widget.version;
      changed = true;
   }
   return changed;
}

function createSharedInstance(): Instance {
   // without the constructor, which needs a store
   let instance: Instance = Object.create(Instance.prototype);
   instance.id = SHARED_INSTANCE_ID;
   instance.initialized = true;
   instance.visible = true;
   return instance;
}
