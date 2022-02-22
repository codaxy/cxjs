import { VDOM } from "../ui/Widget";
import { BoundedObject } from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";

export class PieLabel extends BoundedObject {
   declareData(...args) {
      super.declareData(...args, {
         distance: undefined,
      });
   }

   calculateBounds(context, instance) {
      var { data } = instance;
      var bounds = Rect.add(Rect.add(Rect.multiply(instance.parentRect, data.anchors), data.offset), data.margin);
      instance.originalBounds = bounds;
      instance.actualBounds = context.placePieLabel(bounds, data.distance);
      return new Rect({ t: 0, r: bounds.width(), b: bounds.height(), l: 0 });
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      if (!context.registerPieLabel)
         throw new Error("PieLabel components are allowed only within PieLabelsContainer components.");
      context.registerPieLabel(instance);
   }

   render(context, instance, key) {
      let { originalBounds, actualBounds } = instance;

      return (
         <g key={key}>
            <line
               x1={actualBounds.l < originalBounds.l ? actualBounds.r : actualBounds.l}
               y1={(actualBounds.t + actualBounds.b) / 2}
               x2={(originalBounds.l + originalBounds.r) / 2}
               y2={(originalBounds.t + originalBounds.b) / 2}
               stroke="gray"
            />
            <g transform={`translate(${instance.actualBounds.l} ${instance.actualBounds.t})`}>
               {this.renderChildren(context, instance)}
            </g>
         </g>
      );
   }
}

PieLabel.prototype.distance = 100;
