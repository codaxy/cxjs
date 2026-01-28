/** @jsxImportSource react */

import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../../svg/BoundedObject";
import { VDOM } from "../../ui/Widget";
import { isUndefined } from "../../util/isUndefined";
import { parseStyle } from "../../util/parseStyle";
import { RenderingContext } from "../../ui/RenderingContext";
import { Instance } from "../../ui/Instance";
import { BooleanProp, StyleProp, ClassProp, Prop } from "../../ui/Prop";

export interface AxisConfig extends BoundedObjectConfig {
   /** Set to `true` for vertical axes. */
   vertical?: boolean;

   /** Used as a secondary axis. Displayed at the top/right. */
   secondary?: boolean;

   /** When set to `true`, the values are displayed in descending order. */
   inverted?: BooleanProp;

   /** When set to `true`, rendering of visual elements of the axis, such as ticks and labels, is skipped, but their function is preserved. */
   hidden?: boolean;

   /** Size of the axis tick line. Defaults to 3. */
   tickSize?: number;

   /** Distance between ticks and the axis. Default is 0. Use negative values for offset to make ticks appear on both sides of the axis. */
   tickOffset?: number;

   /** The smallest distance between two ticks on the axis. Defaults to 25. */
   minTickDistance?: number;

   /** The smallest distance between two labels on the vertical axis. Defaults to 40. */
   minLabelDistanceVertical?: number;

   /** The smallest distance between two labels on the horizontal axis. Defaults to 50.  */
   minLabelDistanceHorizontal?: number;

   /** Distance between labels and the axis. Defaults to 10. */
   labelOffset?: number | string;

   /** Label rotation angle in degrees. */
   labelRotation?: Prop<number | string>;

   /** Label text-anchor value. Allowed values are start, end and middle. Default value is set based on the value of vertical and secondary flags. */
   labelAnchor?: "start" | "end" | "middle" | "auto";

   /** Horizontal text offset. */
   labelDx?: number | string;

   /** Vertical text offset which can be used for vertical alignment. */
   labelDy?: number | string;

   /** Set to `true` to break long labels into multiple lines. Default value is `false`. Text is split at space characters. See also `labelMaxLineLength` and `labelLineCountDyFactor`. */
   labelWrap?: boolean;

   /**
    * Used for vertical adjustment of multi-line labels. Default value is `auto` which means
    * that value is initialized based on axis configuration. Value `0` means that label will grow towards
    * the bottom of the screen. Value `-1` will make labels to grow towards the top of the screen.
    * `-0.5` will make labels vertically centered.
    */
   labelLineCountDyFactor?: number | string;

   /**
    * Used for vertical adjustment of multi-line labels. Default value is 1 which means
    * that labels are stacked without any space between them. Value of 1.4 will add 40% of the label height as a space between labels.
    */
   labelLineHeight?: number | string;

   /** If `labelWrap` is on, this number is used as a measure to split labels into multiple lines. Default value is `10`. */
   labelMaxLineLength?: number;

   /** Set to true to hide the axis labels. */
   hideLabels?: boolean;

   /** Set to true to hide the axis line. */
   hideLine?: boolean;

   /** Set to true to hide the axis ticks. */
   hideTicks?: boolean;

   /** Additional CSS style to be applied to the axis line. */
   lineStyle?: StyleProp;

   /** Additional CSS style to be applied to the axis ticks. */
   tickStyle?: StyleProp;

   /** Additional CSS style to be applied to the axis labels. */
   labelStyle?: StyleProp;

   /** Additional CSS class to be applied to the axis line. */
   lineClass?: ClassProp;

   /** Additional CSS class to be applied to the axis ticks. */
   tickClass?: ClassProp;

   /** Additional CSS class to be applied to the axis labels. */
   labelClass?: ClassProp;

   onMeasured?: (info: any, instance: Instance) => void;

   /** A function used to create a formatter function for axis labels. */
   onCreateLabelFormatter?:
      | string
      | ((
           context: any,
           instance: Instance,
        ) => (
           formattedValue: string,
           value: any,
           info: { tickIndex: number; serieIndex: number },
        ) => { text: string; style?: any; className?: string }[]);

   /** Distance between the even labels and the axis. */
   alternateLabelOffset?: number | string;

   useGridlineTicks?: boolean;
}

export interface AxisInstance extends BoundedObjectInstance {
   calculator: any;
   labelFormatter?: any;
   cached: { axis?: any };
}

export class Axis extends BoundedObject<AxisConfig, AxisInstance> {
   declare baseClass: string;
   declare vertical: boolean;
   declare secondary: boolean;
   declare inverted: boolean;
   declare hidden: boolean;
   declare hideLabels: boolean;
   declare hideTicks: boolean;
   declare hideLine: boolean;
   declare tickSize: number;
   declare tickOffset: number;
   declare minTickDistance: number;
   declare minLabelDistance: number;
   declare minLabelDistanceVertical: number;
   declare minLabelDistanceHorizontal: number;
   declare labelOffset: number;
   declare alternateLabelOffset: number | null;
   declare labelRotation: number;
   declare labelAnchor: string;
   declare labelDx: number | string;
   declare labelDy: number | string;
   declare labelWrap: boolean;
   declare labelLineCountDyFactor: number | string;
   declare labelLineHeight: number;
   declare labelMaxLineLength: number;
   declare lineStyle: any;
   declare tickStyle: any;
   declare labelStyle: any;
   declare useGridlineTicks: boolean;
   declare onCreateLabelFormatter: AxisConfig["onCreateLabelFormatter"];
   declare onMeasured: AxisConfig["onMeasured"];

   constructor(config?: AxisConfig) {
      super(config);
   }

   init(): void {
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

   declareData(...args: any[]): void {
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
         ...args,
      );
   }

   prepareData(context: RenderingContext, instance: AxisInstance): void {
      super.prepareData(context, instance);
      if (this.onCreateLabelFormatter)
         instance.labelFormatter = instance.invoke("onCreateLabelFormatter", context, instance);
   }

   report(context: RenderingContext, instance: AxisInstance): any {
      return instance.calculator;
   }

   reportData(context: RenderingContext, instance: AxisInstance): void {}

   renderTicksAndLabels(context: RenderingContext, instance: AxisInstance, valueFormatter: (v: any) => string, minLabelDistance: number): any {
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

      var res: any[] = [null, null];

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

      var t: string[] = [];
      if (!!size && !data.hideLabels) {
         var ticks = calculator.getTicks([size]);
         ticks.forEach((serie: any[], si: number) => {
            serie.forEach((v: any, i: number) => {
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

               var transform = data.labelRotation ? `rotate(${data.labelRotation} ${x} ${y})` : undefined;
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
            gridlines.forEach((s: number, i: number) => {
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

   wrapLines(str: any): { text: string; style?: any; className?: string }[] | null {
      if (!this.labelWrap || typeof str != "string") return [{ text: str }];

      let parts = str.split(" ");
      if (parts.length == 0) return null;

      let lines: { text: string }[] = [];
      let line: string | null = null;
      for (let i = 0; i < parts.length; i++) {
         if (!line) line = parts[i];
         else if (parts[i].length + line.length < this.labelMaxLineLength) line += " " + parts[i];
         else {
            lines.push({ text: line });
            line = parts[i];
         }
      }
      if (line) lines.push({ text: line });
      return lines;
   }

   renderLabels(lines: { text: string; style?: any; className?: string; data?: Record<string, any> }[], x: number, dy: number | string, dx: number | string, offsetClass: string): React.ReactNode[] {
      let offset = (this.labelLineCountDyFactor as number) * (lines.length - 1);
      let result = [];

      if (lines.length > 1 && dy != null) {
         result.push(
            <tspan key={-2} className={offsetClass} dy={dy}>
               _
            </tspan>,
         );
      }

      lines.forEach((p, i) => {
         let data =
            p.data != null
               ? Object.entries(p.data).reduce((acc, [key, val]) => {
                    acc[`data-${key}`] = val;
                    return acc;
                 }, {} as Record<string, any>)
               : null;
         result.push(
            <tspan
               key={i}
               dy={lines.length > 1 ? `${i == 0 ? offset : this.labelLineHeight}em` : dy}
               x={x}
               style={p.style}
               className={p.className}
               dx={dx}
               {...data}
            >
               {p.text}
            </tspan>,
         );
      });
      return result;
   }

   prepare(context: RenderingContext, instance: AxisInstance): void {
      super.prepare(context, instance);
      var { bounds } = instance.data;
      var [a, b] = !this.vertical ? [bounds.l, bounds.r] : [bounds.b, bounds.t];
      instance.calculator.measure(a, b);
      if (this.onMeasured) instance.invoke("onMeasured", instance.calculator.hash(), instance);
      if (!instance.calculator.isSame(instance.cached.axis)) instance.markShouldUpdate(context);
   }

   cleanup(context: RenderingContext, instance: AxisInstance): void {
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
