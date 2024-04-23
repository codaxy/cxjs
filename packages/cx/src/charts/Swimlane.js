import { BoundedObject } from "../svg/BoundedObject";
import { parseStyle } from "../util/parseStyle";
import { VDOM } from "../ui/Widget";
import { Rect } from "../svg/util/Rect";

export class Swimlane extends BoundedObject {
   init() {
      this.laneStyle = parseStyle(this.laneStyle);
      super.init();
   }

   declareData(...args) {
      super.declareData(...args, {
         size: undefined,
         laneOffset: undefined,
         laneStyle: { structured: true },
         vertical: undefined,
         x: undefined,
         y: undefined,
      });
   }

   explore(context, instance) {
      let { data } = instance;
      super.explore(context, instance);
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];

      if (data.vertical) {
         instance.xAxis.acknowledge(data.x, data.size, data.laneOffset);
      } else {
         instance.yAxis.acknowledge(data.y, data.size, data.laneOffset);
      }
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      instance.bounds = this.calculateRect(instance);
      instance.cache("bounds", instance.bounds);
      if (!instance.bounds.isEqual(instance.cached.bounds)) instance.markShouldUpdate(context);

      context.push("parentRect", instance.bounds);
   }

   calculateRect(instance) {
      var { data } = instance;
      var { size, laneOffset } = data;

      if (data.vertical) {
         var x1 = instance.xAxis.map(data.x, laneOffset - size / 2);
         var x2 = instance.xAxis.map(data.x, laneOffset + size / 2);
         var bounds = new Rect({
            l: Math.min(x1, x2),
            r: Math.max(x1, x2),
            t: data.bounds.t,
            b: data.bounds.b,
         });
      } else {
         var y1 = instance.yAxis.map(data.y, laneOffset - size / 2);
         var y2 = instance.yAxis.map(data.y, laneOffset + size / 2);
         var bounds = new Rect({
            l: data.bounds.l,
            r: data.bounds.r,
            t: Math.min(y1, y2),
            b: Math.max(y1, y2),
         });
      }

      return bounds;
   }

   render(context, instance, key) {
      let { data, xAxis, yAxis, bounds } = instance;
      let { CSS, baseClass } = this;

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

      let rectClass = CSS.element(baseClass, "lane");

      if (this.vertical) {
         let c1 = axis.map(...valueFunction(data.x, -data.size / 2 + data.laneOffset));
         let c2 = axis.map(...valueFunction(data.x, +data.size / 2 + data.laneOffset));
         return (
            <g key={key} className={data.classNames}>
               <rect
                  key={key}
                  x={bounds.l}
                  y={bounds.t}
                  height={bounds.b - bounds.t}
                  width={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={data.laneStyle}
               />
               {this.renderChildren(context, instance)};
            </g>
         );
      } else {
         let c1 = axis.map(...valueFunction(data.y, -data.size / 2 + data.laneOffset));
         let c2 = axis.map(...valueFunction(data.y, +data.size / 2 + data.laneOffset));
         return (
            <g key={key} className={data.classNames}>
               <rect
                  key={key}
                  x={bounds.l}
                  y={bounds.t}
                  width={bounds.r - bounds.l}
                  height={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={data.laneStyle}
               />
               {this.renderChildren(context, instance)};
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
Swimlane.prototype.vertical = false;

BoundedObject.alias("swimlane", Swimlane);
