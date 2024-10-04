import { BoundedObject } from "../../svg/BoundedObject";
import { VDOM } from "../../ui/Widget";
import { isUndefined } from "../../util/isUndefined";
import { parseStyle } from "../../util/parseStyle";

export class Axis extends BoundedObject {
   init() {
      if (this.labelAnchor == "auto") this.labelAnchor = this.vertical ? (this.secondary ? "start" : "end") : "middle";

      if (this.labelDx == "auto") this.labelDx = 0;

      if (this.labelDy == "auto") this.labelDy = this.vertical ? "0.4em" : this.secondary ? 0 : "0.8em";

      if (isUndefined(this.minLabelDistance))
         this.minLabelDistance = this.vertical ? this.minLabelDistanceVertical : this.minLabelDistanceHorizontal;

      if (this.labelLineCountDyFactor == "auto")
         this.labelLineCountDyFactor = this.vertical ? -this.labelLineHeight / 2 : this.secondary ? -1 : 0;

      this.lineStyle = parseStyle(this.lineStyle);
      this.tickStyle = parseStyle(this.tickStyle);
      this.labelStyle = parseStyle(this.labelStyle);

      super.init();
   }

   declareData() {
      super.declareData(
         {
            anchors: undefined,
            hideLabels: undefined,
            hideLine: undefined,
            hideTicks: undefined,
            labelRotation: undefined,
            labelAnchor: undefined,
            lineStyle: undefined,
            lineClass: undefined,
            labelStyle: undefined,
            labelClass: undefined,
            tickStyle: undefined,
            tickClass: undefined,
         },
         ...arguments,
      );
   }

   prepareData(context, instance) {
      super.prepareData(context, instance);
      if (this.onCreateLabelFormatter)
         instance.labelFormatter = instance.invoke("onCreateLabelFormatter", context, instance);
   }

   report(context, instance) {
      return instance.calculator;
   }

   reportData(context, instance) {}

   renderTicksAndLabels(context, instance, valueFormatter, minLabelDistance) {
      if (this.hidden) return false;

      var { data, calculator, labelFormatter } = instance;
      var { bounds } = data;
      let { CSS, baseClass } = this;
      var size = calculator.findTickSize(minLabelDistance);

      var labelClass = CSS.expand(CSS.element(baseClass, "label"), data.labelClass);
      var offsetClass = CSS.element(baseClass, "label-offset");

      var x1,
         y1,
         x2,
         y2,
         tickSize = this.tickSize,
         tickOffset = this.tickOffset;

      if (this.vertical) {
         x1 = x2 = this.secondary ? bounds.r : bounds.l;
         y1 = bounds.b;
         y2 = bounds.t;
      } else {
         x1 = bounds.l;
         x2 = bounds.r;
         y1 = y2 = this.secondary ? bounds.t : bounds.b;
      }

      var res = [null, null];

      if (!data.hideLine) {
         res[0] = (
            <line
               key="line"
               className={CSS.expand(CSS.element(baseClass, "line"), data.lineClass)}
               style={data.lineStyle}
               x1={x1}
               y1={y1}
               x2={x2}
               y2={y2}
            />
         );
      }

      var t = [];
      if (!!size && !data.hideLabels) {
         var ticks = calculator.getTicks([size]);
         ticks.forEach((serie, si) => {
            serie.forEach((v, i) => {
               var s = calculator.map(v);

               if (this.secondary) {
                  x1 = this.vertical ? bounds.r + tickOffset : s;
                  y1 = this.vertical ? s : bounds.t - tickOffset;
                  x2 = this.vertical ? bounds.r + tickOffset + tickSize : s;
                  y2 = this.vertical ? s : bounds.t - tickOffset - tickSize;
               } else {
                  x1 = this.vertical ? bounds.l - tickOffset : s;
                  y1 = this.vertical ? s : bounds.b + tickOffset;
                  x2 = this.vertical ? bounds.l - tickOffset - tickSize : s;
                  y2 = this.vertical ? s : bounds.b + tickOffset + tickSize;
               }

               if (!this.useGridlineTicks) t.push(`M ${x1} ${y1} L ${x2} ${y2}`);

               var x, y;
               let labelOffset =
                  this.alternateLabelOffset != null && i % 2 == 1 ? this.alternateLabelOffset : this.labelOffset;

               if (this.secondary) {
                  x = this.vertical ? bounds.r + labelOffset : s;
                  y = this.vertical ? s : bounds.t - labelOffset;
               } else {
                  x = this.vertical ? bounds.l - labelOffset : s;
                  y = this.vertical ? s : bounds.b + labelOffset;
               }

               var transform = data.labelRotation ? `rotate(${data.labelRotation} ${x} ${y})` : null;
               var formattedValue = valueFormatter(v);
               var lines = labelFormatter
                  ? labelFormatter(formattedValue, v, { tickIndex: si, serieIndex: i })
                  : this.wrapLines(formattedValue);
               res.push(
                  <text
                     key={`label-${si}-${i}`}
                     className={labelClass}
                     style={data.labelStyle}
                     x={x}
                     y={y}
                     textAnchor={data.labelAnchor}
                     transform={transform}
                  >
                     {this.renderLabels(lines, x, this.labelDy, this.labelDx, offsetClass)}
                  </text>,
               );
            });
         });
      }

      if (!data.hideTicks) {
         if (this.useGridlineTicks) {
            let gridlines = calculator.mapGridlines();
            gridlines.forEach((s, i) => {
               if (this.secondary) {
                  x1 = this.vertical ? bounds.r + tickOffset : s;
                  y1 = this.vertical ? s : bounds.t - tickOffset;
                  x2 = this.vertical ? bounds.r + tickOffset + tickSize : s;
                  y2 = this.vertical ? s : bounds.t - tickOffset - tickSize;
               } else {
                  x1 = this.vertical ? bounds.l - tickOffset : s;
                  y1 = this.vertical ? s : bounds.b + tickOffset;
                  x2 = this.vertical ? bounds.l - tickOffset - tickSize : s;
                  y2 = this.vertical ? s : bounds.b + tickOffset + tickSize;
               }
               t.push(`M ${x1} ${y1} L ${x2} ${y2}`);
            });
         }

         res[1] = (
            <path
               key="ticks"
               className={CSS.expand(CSS.element(baseClass, "ticks"), data.tickClass)}
               style={data.tickStyle}
               d={t.join(" ")}
            />
         );
      }

      return res;
   }

   wrapLines(str) {
      if (!this.labelWrap || typeof str != "string") return [{ text: str }];

      let parts = str.split(" ");
      if (parts.length == 0) return null;

      let lines = [];
      let line = null;
      for (let i = 0; i < parts.length; i++) {
         if (!line) line = parts[i];
         else if (parts[i].length + line.length < this.labelMaxLineLength) line += " " + parts[i];
         else {
            lines.push({ text: line });
            line = parts[i];
         }
      }
      lines.push({ text: line });
      return lines;
   }

   renderLabels(lines, x, dy, dx, offsetClass) {
      let offset = this.labelLineCountDyFactor * (lines.length - 1);
      let result = [];

      if (lines.length > 1 && dy != null) {
         result.push(
            <tspan key={-2} className={offsetClass} dy={dy}>
               _
            </tspan>,
         );
      }

      lines.forEach((p, i) => {
         result.push(
            <tspan
               key={i}
               dy={lines.length > 1 ? `${i == 0 ? offset : this.labelLineHeight}em` : dy}
               x={x}
               style={p.style}
               className={p.className}
               dx={dx}
            >
               {p.text}
            </tspan>,
         );
      });
      return result;
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      var { bounds } = instance.data;
      var [a, b] = !this.vertical ? [bounds.l, bounds.r] : [bounds.b, bounds.t];
      instance.calculator.measure(a, b);
      if (this.onMeasured) instance.invoke("onMeasured", instance.calculator.hash(), instance);
      if (!instance.calculator.isSame(instance.cached.axis)) instance.markShouldUpdate(context);
   }

   cleanup(context, instance) {
      var { cached, calculator } = instance;
      cached.axis = calculator.hash();
   }
}

Axis.prototype.anchors = "0 1 1 0";
Axis.prototype.styled = true;
Axis.prototype.vertical = false;
Axis.prototype.secondary = false;
Axis.prototype.inverted = false;
Axis.prototype.hidden = false;
Axis.prototype.hideLabels = false;
Axis.prototype.hideTicks = false;
Axis.prototype.hideLine = false;

Axis.prototype.tickSize = 3;
Axis.prototype.tickOffset = 0;
Axis.prototype.minTickDistance = 25;
Axis.prototype.minLabelDistanceVertical = 40;
Axis.prototype.minLabelDistanceHorizontal = 50;
Axis.prototype.labelOffset = 10;
Axis.prototype.alternateLabelOffset = null;
Axis.prototype.labelRotation = 0;
Axis.prototype.labelAnchor = "auto";
Axis.prototype.labelDx = "auto";
Axis.prototype.labelDy = "auto";
Axis.prototype.labelWrap = false;
Axis.prototype.labelLineCountDyFactor = "auto";
Axis.prototype.labelLineHeight = 1;
Axis.prototype.labelMaxLineLength = 10;

Axis.namespace = "ui.svg.chart.axis";
