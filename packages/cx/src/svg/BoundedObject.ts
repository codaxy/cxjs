import { Instance } from "./../ui/Instance";
import { StyledContainerConfig } from "../ui/Container";
import * as Cx from "../core";
import { PureContainer } from "../ui/PureContainer";
import { IRect, Rect } from "./util/Rect";

export interface BoundedObjectConfig extends StyledContainerConfig {
   /**
    * Anchor defines how child bounds are tied to the parent. Zero aligns with the top/left edge.
    * One aligns with the bottom/right edge. See Svg for more information.
    */
   anchors?: Cx.Prop<string | number | IRect>;

   /** Move boundaries specified by the offset. See Svg for more information. */
   offset?: Cx.Prop<string | number | IRect>;

   /** Apply margin to the given boundaries. See Svg for more information. */
   margin?: Cx.Prop<string | number | IRect>;

   /** Padding to be applied to the boundaries rectangle before passing to the children. */
   padding?: Cx.Prop<string | number | IRect>;
}

export class BoundedObject<Config extends BoundedObjectConfig = BoundedObjectConfig> extends PureContainer<Config> {
   anchors: any = 0;
   margin: any = 0;
   offset: any = 0;
   padding: any = 0;
   isPureContainer: boolean = false;
   styled: boolean = true;

   declareData(...args: any[]) {
      return super.declareData(
         {
            anchors: undefined,
            offset: undefined,
            margin: undefined,
            padding: undefined,
         },
         ...args,
      );
   }

   prepareData(context: RenderingContext, instance: Instance) {
      super.prepareData(context, instance);
      var { data } = instance;
      data.anchors = Rect.convert(data.anchors);
      data.offset = Rect.convert(data.offset);
      data.margin = Rect.convertMargin(data.margin);
      data.padding = Rect.convertMargin(data.padding);
   }

   calculateBounds(context: RenderingContext, instance: Instance) {
      var { data } = instance;
      return Rect.add(Rect.add(Rect.multiply(instance.parentRect, data.anchors), data.offset), data.margin);
   }

   prepareBounds(context: RenderingContext, instance: Instance) {
      var { data } = instance;
      if (
         instance.shouldUpdate ||
         !instance.cached.parentRect ||
         !instance.cached.parentRect.isEqual(context.parentRect) ||
         !data.bounds
      ) {
         if (!context.parentRect) throw new Error("Parent bounds were not provided through the context.");
         instance.parentRect = context.parentRect;
         instance.cache("parentRect", context.parentRect);
         instance.markShouldUpdate(context);
         data.bounds = this.calculateBounds(context, instance);
         data.childrenBounds = Rect.add(data.bounds, data.padding);
      }
   }

   prepare(context: RenderingContext, instance: Instance) {
      this.prepareBounds(context, instance);
      context.push("parentRect", instance.data.childrenBounds);
   }

   prepareCleanup(context: RenderingContext, instance: Instance) {
      context.pop("parentRect");
   }
}
