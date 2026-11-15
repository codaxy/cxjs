import type { View } from "../data/View";
import type { Widget } from "./Widget";

/**
 * A child in the widget tree, as its parent keeps it in `children` and in its instance cache: an `Instance`, or the
 * state of a child rendered without an instance of its own, such as a `ChildState`.
 */
export class InstanceBase<WidgetType extends Widget<any, any> = Widget<any, any>> {
   declare public widget: WidgetType;
   declare public key: string;
   declare public dataSelector?: (store: View) => Record<string, any>;
   declare public visible?: boolean;
   declare public rawData: Record<string, any>;
   declare public data: Record<string, any>;
   /** What the child rendered. */
   declare public vdom?: any;
   /** The explore pass in which the parent's instance cache last marked the child; see InstanceCache. */
   declare public cachePass?: number;

   constructor(widget: WidgetType, key: string) {
      this.widget = widget;
      this.key = key;
   }
}
