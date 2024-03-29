import { BoundedObject } from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { Widget } from "../ui/Widget";

export class RangeMarker extends BoundedObject {
   init() {
      super.init();
   }

   declareData() {
      super.declareData(...arguments, {
         x: undefined,
         y: undefined,
         data: undefined,
         name: undefined,
         rangeType: undefined,
         width: undefined,
         height: undefined,
         vertical: undefined,
         markerClass: undefined,
         size: undefined,
      });
   }

   prepareData(context, instance) {
      instance.axes = context.axes;
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      super.prepareData(context, instance);
   }

   calculateBounds(context, instance) {
      let { data, xAxis, yAxis } = instance;

      let x, y;

      if (data.x == null || data.y == null) {
         let bounds = super.calculateBounds(context, instance);
         x = (bounds.l + bounds.r) / 2;
         y = (bounds.t + bounds.b) / 2;
      }

      if (data.x != null) x = xAxis.map(data.x);

      if (data.y != null) y = yAxis.map(data.y);

      return new Rect({
         l: x - data.size / 2,
         r: x + data.size / 2,
         t: y - data.size / 2,
         b: y + data.size / 2,
      });
   }

   prepare(context, instance) {
      super.prepare(context, instance);
   }

   render(context, instance, key) {
      var { data, xAxis, yAxis, store } = instance;
      let { CSS, baseClass } = this;
      let { bounds, rangeType } = data;

      let cx = (bounds.l + bounds.r) / 2;
      let cy = (bounds.t + bounds.b) / 2;

      let path = "";
      path += `M ${bounds.r} ${cy - 5} `;
      path += `L ${bounds.l} ${cy - 5}`;

      return (
         <g key={key}>
            <path d={path} stroke="red" />
         </g>
      );
   }

   maxRangeMarker(cx, cy, vertical, height, width, props, options) {
      var d = "";

      if (vertical) {
         d += `M ${cx - width * 2} ${cy - height}`;
         d += `L ${cx} ${cy - height}`;
         d += `L ${cx} ${cy + height}`;
         d += `L ${cx - width * 2} ${cy + height}`;
      } else {
         d += `M ${cx - width / 2} ${cy + height}`;
         d += `L ${cx - width / 2} ${cy}`;
         d += `L ${cx + width / 2} ${cy}`;
         d += `L ${cx + width / 2} ${cy + height}`;
      }

      return <path {...props} d={d} />;
   }

   minRangeMarker(cx, cy, vertical, height, width, props, options) {
      var d = "";
      if (vertical) {
         d += `M ${cx + width * 2} ${cy - height}`;
         d += `L ${cx} ${cy - height}`;
         d += `L ${cx} ${cy + height}`;
         d += `L ${cx + width * 2} ${cy + height}`;
      } else {
         d += `M ${cx - width / 2} ${cy - height}`;
         d += `L ${cx - width / 2} ${cy}`;
         d += `L ${cx + width / 2} ${cy}`;
         d += `L ${cx + width / 2} ${cy - height}`;
      }

      return <path {...props} d={d} />;
   }

   optimalRangeMarker(cx, cy, vertical, height, width, props, options) {
      var d = "";
      if (vertical) {
         d += `M ${cx} ${cy - height}`;
         d += `L ${cx} ${cy + height}`;
      } else {
         d += `M ${cx - width / 2} ${cy - height}`;
         d += `L ${cx + width / 2} ${cy - height}`;
      }
      return <path {...props} d={d} />;
   }
}

RangeMarker.prototype.baseClass = "rangemarker";
RangeMarker.prototype.xAxis = "x";
RangeMarker.prototype.yAxis = "y";

RangeMarker.prototype.xField = "x";
RangeMarker.prototype.yField = "y";

RangeMarker.prototype.styled = true;
RangeMarker.prototype.rangeType = "max";
RangeMarker.prototype.width = 80;
RangeMarker.prototype.height = 10;
RangeMarker.prototype.vertical = true;
RangeMarker.prototype.size = 5;

Widget.alias("range-marker", RangeMarker);
