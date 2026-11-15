import type { View } from "../data/View";
import { InstanceBase } from "./InstanceBase";
import type { Widget } from "./Widget";

/**
 * A child widget rendered through the shared instance, without an instance of its own (see
 * SharedInstance). It keeps what an instance would keep between renders.
 */
export class ChildState extends InstanceBase {
   declare public dataSelector: (store: View) => Record<string, any>;
   declare public globalCacheIdentifier?: number;
   declare public widgetVersion?: number;
   /** The states of the widget's items, in order, for a container whose items share the instance too. */
   declare public itemStates?: ChildState[];

   /** The state of a widget rendered through the shared instance, kept under `key`. */
   static create(widget: Widget, key: string, store: View): ChildState {
      // as Instance.init, this writes the default values of the widget's bindings to the store
      widget.selector!.init(store);
      return new ChildState(widget, key, widget.selector!.createStoreSelector());
   }

   constructor(widget: Widget, key: string, dataSelector: (store: View) => Record<string, any>) {
      super(widget, key);
      this.dataSelector = dataSelector;
      // all states get the same shape; the data is set when the state is first rendered
      let unset: Partial<ChildState> = this;
      unset.visible = unset.rawData = unset.data = unset.vdom = unset.cachePass = undefined;
      this.globalCacheIdentifier = undefined;
      this.widgetVersion = undefined;
      this.itemStates = undefined;
   }
}
