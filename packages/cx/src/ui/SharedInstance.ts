import type { View } from "../data/View";
import { GlobalCacheIdentifier } from "../util/GlobalCacheIdentifier";
import type { ChildState } from "./ChildState";
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

const SHARED_INSTANCE_ID = "shared-instance";

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
   released.rawData = released.data = released.cached = undefined;
}

/**
 * Updates the state of a child rendered through the shared instance, as Instance.checkVisible, Instance.explore
 * and Instance.render would update an instance of its own. The widget's methods get the shared instance with the
 * state loaded. Returns true if the child became visible or hidden, or rendered again.
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

   let globalCacheIdentifier = GlobalCacheIdentifier.get();
   if (
      rawData !== state.rawData ||
      globalCacheIdentifier !== state.globalCacheIdentifier ||
      widget.version !== state.widgetVersion ||
      !widget.memoize
   ) {
      instance.data = { ...rawData };
      instance.cached = {};
      widget.prepareData(context, instance);
      state.vdom = renderResultFix(widget.render(context, instance, state.key));
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
