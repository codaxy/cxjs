import { BoundedObject } from "../svg/BoundedObject";
import { parseStyle } from "../util/parseStyle";
import { VDOM } from "../ui/Widget";
import { Rect } from "../svg";

export class Swimlane extends BoundedObject {
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
         x: undefined,
         y: undefined,
      });
   }

   explore(context, instance) {
      let { data } = instance;
      super.explore(context, instance);
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      instance.xAxis.acknowledge(data.x, data.size, data.laneOffset);
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      instance.bounds = this.calculateRect(instance);
      instance.cache("bounds", instance.bounds);
      if (!instance.bounds.isEqual(instance.cached.bounds)) instance.markShouldUpdate(context);
   }

   calculateRect(instance) {
      var { data } = instance;
      var { offset, size, laneOffset } = data;

      if (data.autoSize) {
         var [index, count] = instance.xAxis.locate(data.x, data.stacked ? data.stack : data.name);
         offset = (size / count) * (index - count / 2 + 0.5);
         size = size / count;
      }

      var x1 = instance.xAxis.map(data.x, laneOffset - size / 2);
      var x2 = instance.xAxis.map(data.x, laneOffset + size / 2);
      var y1 = instance.yAxis.map(data.y0);
      var y2 = instance.yAxis.map(data.y);

      if (Math.abs(y2 - y1) < this.minPixelHeight) {
         if (y1 <= y2) y2 = y1 + this.minPixelHeight;
         else y2 = y1 - this.minPixelHeight;
      }

      var bounds = new Rect({
         l: Math.min(x1, x2),
         r: Math.max(x1, x2),
         t: Math.min(y1, y2),
         b: Math.max(y1, y2),
      });
      return bounds;
   }

   render(context, instance, key) {
      let { data, xAxis, yAxis, bounds } = instance;

      let { CSS, baseClass } = this;

      let parentBound = data.bounds;

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

      let index = 0;
      let rectClass = CSS.element(baseClass, "lane");

      let c1 = axis.map(...valueFunction(data.x, -data.size / 2 + data.laneOffset));
      let c2 = axis.map(...valueFunction(data.x, +data.size / 2 + data.laneOffset));
      if (this.vertical) {
         return (
            <g key={key} className={data.classNames}>
               <rect
                  key={index++}
                  x={bounds.l}
                  y={parentBound.t}
                  height={parentBound.b - parentBound.t}
                  width={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={data.laneStyle}
               />
               ;
            </g>
         );
      } else {
         return (
            <g key={key} className={data.classNames}>
               <rect
                  key={index++}
                  x={bounds.l}
                  y={Math.min(c1, c2)}
                  width={bounds.r - bounds.l}
                  height={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={data.laneStyle}
               />
               ;
            </g>
         );
      }
   }
}

Swimlane.prototype.xAxis = "x";
Swimlane.prototype.yAxis = "y";
Swimlane.prototype.anchors = "0 1 1 0";
Swimlane.prototype.baseClass = "swimlane";
Swimlane.prototype.size = 0.5;
Swimlane.prototype.laneOffset = 0;
Swimlane.prototype.step = 1;
Swimlane.prototype.vertical = false;
Swimlane.prototype.styled = true;

BoundedObject.alias("swimlane", Swimlane);
