import { BoundedObject } from "../svg/BoundedObject";
import { parseStyle } from "../util/parseStyle";
import { VDOM } from "../ui/Widget";

export class Swimlanes extends BoundedObject {
   init() {
      this.laneStyle = parseStyle(this.laneStyle);
      super.init();
   }
   declareData(...args) {
      super.declareData(...args, {
         size: undefined,
         step: undefined,
         laneOffset: undefined,
         laneStyle: { structured: true },
      });
   }

   explore(context, instance) {
      super.explore(context, instance);
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      let { xAxis, yAxis } = instance;
      if ((xAxis && xAxis.shouldUpdate) || (yAxis && yAxis.shouldUpdate)) instance.markShouldUpdate(context);
   }

   render(context, instance, key) {
      let { data, xAxis, yAxis } = instance;
      let { bounds } = data;
      let { CSS, baseClass } = this;

      if (data.step <= 0 || data.size <= 0) return;

      let axis = this.vertical ? xAxis : yAxis;

      if (!axis) return null;

      let min, max, valueFunction;

      if (axis.scale) {
         min = axis.scale.min;
         max = axis.scale.max;
         let clamp = (value) => [Math.max(min, Math.min(max, value)), 0];
         valueFunction = (value, offset) => clamp(value + offset);
      } else if (axis.valueList) {
         min = 0;
         max = axis.valueList.length;
         valueFunction = (value, offset) => [axis.valueList[value], offset];
      }

      if (!(min < max)) return null;

      let rects = [];

      let at = Math.ceil(min / data.step) * data.step;
      let index = 0;

      let rectClass = CSS.element(baseClass, "lane");

      while (at - data.size / 2 < max) {
         let c1 = axis.map(...valueFunction(at, -data.size / 2 + data.laneOffset));
         let c2 = axis.map(...valueFunction(at, +data.size / 2 + data.laneOffset));
         if (this.vertical) {
            rects.push(
               <rect
                  key={index++}
                  y={bounds.t}
                  x={Math.min(c1, c2)}
                  height={bounds.b - bounds.t}
                  width={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={data.laneStyle}
               />,
            );
         } else {
            rects.push(
               <rect
                  key={index++}
                  x={bounds.l}
                  y={Math.min(c1, c2)}
                  width={bounds.r - bounds.l}
                  height={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={data.laneStyle}
               />,
            );
         }

         at += data.step;
      }

      return (
         <g key={key} className={data.classNames}>
            {rects}
         </g>
      );
   }
}

Swimlanes.prototype.xAxis = "x";
Swimlanes.prototype.yAxis = "y";
Swimlanes.prototype.anchors = "0 1 1 0";
Swimlanes.prototype.baseClass = "swimlanes";
Swimlanes.prototype.size = 0.5;
Swimlanes.prototype.laneOffset = 0;
Swimlanes.prototype.step = 1;
Swimlanes.prototype.vertical = false;
Swimlanes.prototype.styled = true;

BoundedObject.alias("swimlanes", Swimlanes);
