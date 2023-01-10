import { VDOM } from "../ui/Widget";
import { BoundedObject } from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { parseStyle } from "../util/parseStyle";

export class PieLabel extends BoundedObject {
   init() {
      this.lineStyle = parseStyle(this.lineStyle);
      super.init();
   }

   declareData(...args) {
      super.declareData(...args, {
         distance: undefined,
         lineStyle: { structured: true },
         lineStroke: undefined,
         lineClass: { structured: true },
         lineColorIndex: undefined,
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
      let { originalBounds, actualBounds, data } = instance;

      return (
         <g key={key} className={data.classNames}>
            <line
               className={this.CSS.element(
                  this.baseClass,
                  "line",
                  data.lineColorIndex != null && "color-" + data.lineColorIndex
               )}
               x1={actualBounds.l < originalBounds.l ? actualBounds.r : actualBounds.l}
               y1={(actualBounds.t + actualBounds.b) / 2}
               x2={(originalBounds.l + originalBounds.r) / 2}
               y2={(originalBounds.t + originalBounds.b) / 2}
               stroke={data.lineStroke}
               style={data.lineStyle}
            />
            <g transform={`translate(${instance.actualBounds.l} ${instance.actualBounds.t})`}>
               {this.renderChildren(context, instance)}
            </g>
         </g>
      );
   }
}

PieLabel.prototype.distance = 100;
PieLabel.prototype.baseClass = "pielabel";
PieLabel.prototype.styled = true;
