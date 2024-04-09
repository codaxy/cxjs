import { BoundedObject } from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { Widget, VDOM } from "../ui/Widget";
import { parseStyle } from "../util/parseStyle";

export class RangeMarker extends BoundedObject {
   declareData() {
      super.declareData(...arguments, {
         x: undefined,
         y: undefined,
         shape: undefined,
         vertical: undefined,
         size: undefined,
         laneOffset: undefined,
         lineStyle: { structured: true },
         lineClass: { structured: true },
         capSize: undefined,
         inflate: undefined,
      });
   }

   init() {
      this.lineStyle = parseStyle(this.lineStyle);
      super.init();
   }

   prepareData(context, instance) {
      instance.axes = context.axes;
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      super.prepareData(context, instance);
   }

   explore(context, instance) {
      let { data, xAxis, yAxis } = instance;

      if (this.affectsAxes) {
         if (xAxis && data.x != null) xAxis.acknowledge(data.x, 0, 0);
         if (yAxis && data.y != null) yAxis.acknowledge(data.y, 0, 0);
      }

      super.explore(context, instance);
   }

   calculateBounds(context, instance) {
      let { data, xAxis, yAxis } = instance;

      let l, r, t, b;

      if (data.x == null || data.y == null) {
         return super.calculateBounds(context, instance);
      }

      if (!this.vertical) {
         l = xAxis.map(data.x, data.laneOffset - data.size / 2) - data.inflate;
         r = xAxis.map(data.x, data.laneOffset + data.size / 2) + data.inflate;
         t = b = yAxis.map(data.y);
         if (data.shape == "max") {
            b += data.capSize;
         } else if (data.shape == "min") {
            t -= data.capSize;
         }
      } else {
         l = r = xAxis.map(data.x);
         t = yAxis.map(data.y, data.laneOffset - data.size / 2) + data.inflate;
         b = yAxis.map(data.y, data.laneOffset + data.size / 2) - data.inflate;
         if (data.shape == "max") {
            l -= data.capSize;
         } else if (data.shape == "min") {
            r += data.capSize;
         }
      }

      return new Rect({
         l,
         r,
         t,
         b,
      });
   }

   prepare(context, instance) {
      super.prepare(context, instance);
   }

   render(context, instance, key) {
      var { data } = instance;
      let { CSS, baseClass } = this;
      let { bounds, shape } = data;

      let path = "";
      if (this.vertical) {
         switch (shape) {
            default:
            case "line":
               path += `M ${bounds.r} ${bounds.t} `;
               path += `L ${bounds.r} ${bounds.b}`;
               break;
            case "max":
               path += `M ${bounds.l} ${bounds.t} `;
               path += `L ${bounds.r} ${bounds.t}`;
               path += `L ${bounds.r} ${bounds.b}`;
               path += `L ${bounds.l} ${bounds.b}`;
               break;
            case "min":
               path += `M ${bounds.r} ${bounds.t} `;
               path += `L ${bounds.l} ${bounds.t}`;
               path += `L ${bounds.l} ${bounds.b}`;
               path += `L ${bounds.r} ${bounds.b}`;
               break;
         }
      } else {
         switch (shape) {
            default:
            case "line":
               path += `M ${bounds.r} ${bounds.t} `;
               path += `L ${bounds.l} ${bounds.t}`;
               break;
            case "max":
               path += `M ${bounds.l} ${bounds.b} `;
               path += `L ${bounds.l} ${bounds.t}`;
               path += `L ${bounds.r} ${bounds.t}`;
               path += `L ${bounds.r} ${bounds.b}`;
               break;
            case "min":
               path += `M ${bounds.l} ${bounds.t} `;
               path += `L ${bounds.l} ${bounds.b}`;
               path += `L ${bounds.r} ${bounds.b}`;
               path += `L ${bounds.r} ${bounds.t}`;
               break;
         }
      }

      return (
         <g key={key} class={data.classNames} style={data.style}>
            <path d={path} class={CSS.expand(CSS.element(baseClass, "path"), data.lineClass)} style={data.lineStyle} />
            {this.renderChildren(context, instance)}
         </g>
      );
   }
}

RangeMarker.prototype.baseClass = "rangemarker";
RangeMarker.prototype.xAxis = "x";
RangeMarker.prototype.yAxis = "y";

RangeMarker.prototype.shape = "line";
RangeMarker.prototype.vertical = false;
RangeMarker.prototype.size = 1;
RangeMarker.prototype.laneOffset = 0;
RangeMarker.prototype.capSize = 5;
RangeMarker.prototype.inflate = 0;
RangeMarker.prototype.affectsAxes = true;

Widget.alias("range-marker", RangeMarker);
