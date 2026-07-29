/** @jsxImportSource react */

import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import { isArray } from "../util/isArray";
import { parseStyle } from "../util/parseStyle";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp, StringProp, RecordsProp, StyleProp } from "../ui/Prop";
import type { ChartRenderingContext } from "./Chart";
import { ClassProp } from "../ui/Prop";

interface LinePoint {
   x: number;
   y: number;
   y0: number;
}

export interface LineGraphConfig extends WidgetConfig {
   /** Data for the graph. Each entry should be an object with at least two properties
    * whose names should match the `xField` and `yField` values.
    */
   data?: RecordsProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: NumberProp;

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: StringProp;

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: StringProp;

   /** Name of the item as it will appear in the legend. */
   name?: StringProp;

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: BooleanProp;

   /** Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`. */
   stack?: StringProp;

   /** Indicate that values should be stacked on top of the other values. Default value is `false`. */
   stacked?: BooleanProp;

   /**
    * Set to `true` to enable smooth (curved) line rendering. Uses monotone cubic
    * interpolation which never overshoots the actual data range, i.e. the curve
    * stays within the vertical bounds of the data.
    */
   smooth?: BooleanProp;

   /** @deprecated Smoothing is based on monotone cubic interpolation and its curvature is not configurable. This property is ignored. */
   smoothingRatio?: NumberProp;

   /** Name of the horizontal axis. Default value is `x`. */
   xAxis?: string;

   /** Name of the vertical axis. Default value is `y`. */
   yAxis?: string;

   /** Name of the property which holds the x value. Default value is `x`. */
   xField?: string;

   /** Name of the property which holds the y value. Default value is `y`. */
   yField?: string;

   /** Name of the property which holds the base value. Default value is `false`, meaning y0 is used instead. */
   y0Field?: string | false;

   /** Base value. Default value is `0`. */
   y0?: NumberProp;

   /** Hide the base value. */
   hiddenBase?: boolean;

   /** Set to `true` to enable area rendering. */
   area?: BooleanProp;

   /** Set to `false` to disable line rendering. Default is `true`. */
   line?: BooleanProp;

   /** Style for the line element. */
   lineStyle?: StyleProp;

   /** Style for the area element. */
   areaStyle?: StyleProp;

   /** Name of the legend to be used. Default is `legend`. Set to `false` to hide the legend entry. */
   legend?: string | false;

   /** Action to perform on legend item click. Default is `auto`. */
   legendAction?: string;

   /** Shape to use in legend. */
   legendShape?: string;

   /**
    * Additional CSS classes to be applied to the field.
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
    */
   class?: ClassProp;

   /**
    * Additional CSS classes to be applied to the field.
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list.
    */
   className?: ClassProp;
}

export interface LineGraphInstance extends Instance {
   xAxis: any;
   yAxis: any;
   axes: Record<string, any>;
   colorMap: any;
   lineSpans: LinePoint[][] | null;
}

export class LineGraph extends Widget {
   declare baseClass: string;
   declare xAxis: string;
   declare yAxis: string;
   declare xField: string;
   declare yField: string;
   declare y0Field: string | false;
   declare y0: number;
   declare hiddenBase: boolean;
   declare area: boolean;
   declare line: boolean;
   declare active: boolean;
   declare legend: string | false;
   declare legendAction: string;
   declare legendShape: string;
   declare stack: string;
   declare smooth: boolean;

   constructor(config: LineGraphConfig) {
      super(config);
   }

   declareData(...args: any[]): void {
      super.declareData(...args, {
         data: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         class: {
            structured: true,
         },
         className: {
            structured: true,
         },
         lineStyle: {
            structured: true,
         },
         areaStyle: {
            structured: true,
         },
         area: undefined,
         line: undefined,
         y0: undefined,
         name: undefined,
         active: true,
         stack: undefined,
         stacked: undefined,
         smooth: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: LineGraphInstance): void {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context: ChartRenderingContext, instance: LineGraphInstance): void {
      let { data } = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);

      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      if (data.active) {
         instance.axes = context.axes!;
         instance.xAxis = instance.axes[this.xAxis];
         instance.yAxis = instance.axes[this.yAxis];
         super.explore(context, instance);
         if (isArray(data.data)) {
            data.data.forEach((p: any) => {
               let x = p[this.xField];
               instance.xAxis.acknowledge(x);
               if (data.stacked) {
                  instance.yAxis.stacknowledge(data.stack, x, this.y0Field ? p[this.y0Field] : data.y0);
                  instance.yAxis.stacknowledge(data.stack, x, p[this.yField]);
               } else {
                  instance.yAxis.acknowledge(p[this.yField]);
                  if (data.area) {
                     if (!this.hiddenBase) instance.yAxis.acknowledge(this.y0Field ? p[this.y0Field] : data.y0);
                  }
               }
            });
         }
      }
   }

   prepare(context: ChartRenderingContext, instance: LineGraphInstance): void {
      let { data, colorMap } = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }

      if (data.active) {
         if (instance.axes[this.xAxis].shouldUpdate || instance.axes[this.yAxis].shouldUpdate)
            instance.markShouldUpdate(context);
      }

      if (data.name && context.addLegendEntry) {
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            style: {
               ...parseStyle(data.style),
               ...parseStyle(data.areaStyle),
               ...parseStyle(data.lineStyle),
            },
            shape: this.legendShape,
            onClick: (e: MouseEvent) => {
               this.onLegendClick(e, instance);
            },
         });
      }

      if (data.active) {
         if (context.pointReducer && isArray(data.data)) {
            data.data.forEach((p: any, index: number) => {
               if (data.area && this.y0Field)
                  context.pointReducer(p[this.xField], p[this.y0Field], data.name, p, data.data, index);
               context.pointReducer(p[this.xField], p[this.yField], data.name, p, data.data, index);
            });
         }
      }

      instance.lineSpans = this.calculateLineSpans(context, instance);
   }

   onLegendClick(e: MouseEvent, instance: LineGraphInstance): void {
      let allActions = this.legendAction == "auto";
      let { data } = instance;
      if (allActions || this.legendAction == "toggle") instance.set("active", !data.active);
   }

   calculateLineSpans(context: RenderingContext, instance: LineGraphInstance): LinePoint[][] | null {
      let { data, xAxis, yAxis } = instance;
      let spans: LinePoint[][] = [];
      let span: LinePoint[] = [];

      if (!data.active) return null;

      isArray(data.data) &&
         data.data.forEach((p: any) => {
            let ax = p[this.xField],
               ay = p[this.yField],
               ay0 = this.y0Field ? p[this.y0Field] : data.y0,
               x: number | undefined,
               y: number | undefined,
               y0: number | undefined;

            if (ax != null && ay != null && ay0 != null) {
               x = xAxis.map(ax);
               y0 = data.stacked ? yAxis.stack(data.stack, ax, ay0) : yAxis.map(ay0);
               y = data.stacked ? yAxis.stack(data.stack, ax, ay) : yAxis.map(ay);
            }

            if (x != null && y != null && y0 != null) span.push({ x, y, y0 });
            else if (span.length > 0) {
               spans.push(span);
               span = [];
            }
         });

      if (span.length > 0) spans.push(span);
      return spans;
   }

   render(context: RenderingContext, instance: LineGraphInstance, key: string): React.ReactNode {
      let { data, lineSpans } = instance;

      if (!lineSpans) return null;

      let stateMods: Record<string, boolean> = {
         ["color-" + data.colorIndex]: data.colorIndex != null,
      };

      let line: React.ReactNode, area: React.ReactNode;

      let linePath = "";
      if (data.line) {
         lineSpans.forEach((span) => {
            if (span.length == 0) return;
            linePath += `M ${span[0].x} ${span[0].y}`;
            if (data.smooth && span.length >= 2) linePath += this.getMonotoneSpanPath(span, "y");
            else
               span.forEach((p, i) => {
                  if (i > 0) linePath += `L ${p.x} ${p.y}`;
               });
         });

         line = (
            <path
               className={this.CSS.element(this.baseClass, "line", stateMods)}
               style={this.CSS.parseStyle(data.lineStyle)}
               d={linePath}
            />
         );
      }

      if (data.area) {
         let areaPath = "";
         lineSpans.forEach((span) => {
            if (span.length == 0) return;
            let last = span[span.length - 1];
            areaPath += `M ${span[0].x} ${span[0].y}`;
            if (data.smooth && span.length >= 2) {
               areaPath += this.getMonotoneSpanPath(span, "y");
               areaPath += `L ${last.x} ${last.y0}`;
               areaPath += this.getMonotoneSpanPath(span, "y0", true);
            } else {
               span.forEach((p, i) => {
                  if (i > 0) areaPath += `L ${p.x} ${p.y}`;
               });
               areaPath += `L ${last.x} ${last.y0}`;
               for (let i = span.length - 2; i >= 0; i--) areaPath += `L ${span[i].x} ${span[i].y0}`;
            }
            areaPath += "Z";
         });

         area = (
            <path
               className={this.CSS.element(this.baseClass, "area", stateMods)}
               style={this.CSS.parseStyle(data.areaStyle)}
               d={areaPath}
            />
         );
      }

      return (
         <g key={key} className={data.classNames}>
            {line}
            {area}
         </g>
      );
   }

   // Fritsch-Carlson monotone cubic interpolation. Tangents are limited so the
   // curve between two points never leaves their vertical range (no overshoot).
   getMonotoneTangents(span: LinePoint[], yField: "y" | "y0"): number[] {
      const n = span.length;
      const m: number[] = new Array(n).fill(0);
      if (n < 2) return m;

      const secant = (i: number): number => {
         const h = span[i + 1].x - span[i].x;
         return h != 0 ? (span[i + 1][yField] - span[i][yField]) / h : 0;
      };

      if (n == 2) {
         m[0] = m[1] = secant(0);
         return m;
      }

      for (let i = 1; i < n - 1; i++) {
         const h0 = span[i].x - span[i - 1].x;
         const h1 = span[i + 1].x - span[i].x;
         const s0 = secant(i - 1);
         const s1 = secant(i);
         const p = (s0 * h1 + s1 * h0) / (h0 + h1);
         m[i] = (Math.sign(s0) + Math.sign(s1)) * Math.min(Math.abs(s0), Math.abs(s1), 0.5 * Math.abs(p)) || 0;
      }

      const hFirst = span[1].x - span[0].x;
      m[0] = hFirst != 0 ? (3 * secant(0) - m[1]) / 2 : m[1];

      const hLast = span[n - 1].x - span[n - 2].x;
      m[n - 1] = hLast != 0 ? (3 * secant(n - 2) - m[n - 2]) / 2 : m[n - 2];

      return m;
   }

   // Emits cubic bezier segments for the whole span using monotone tangents.
   // Assumes the path cursor is at the first (or last, when reversed) span point.
   getMonotoneSpanPath(span: LinePoint[], yField: "y" | "y0", reverse?: boolean): string {
      const m = this.getMonotoneTangents(span, yField);
      let path = "";
      if (!reverse)
         for (let i = 1; i < span.length; i++) {
            const p0 = span[i - 1];
            const p1 = span[i];
            const dx = (p1.x - p0.x) / 3;
            path += `C ${p0.x + dx} ${p0[yField] + dx * m[i - 1]}, ${p1.x - dx} ${p1[yField] - dx * m[i]}, ${p1.x} ${p1[yField]}`;
         }
      else
         for (let i = span.length - 1; i > 0; i--) {
            const p0 = span[i - 1];
            const p1 = span[i];
            const dx = (p1.x - p0.x) / 3;
            path += `C ${p1.x - dx} ${p1[yField] - dx * m[i]}, ${p0.x + dx} ${p0[yField] + dx * m[i - 1]}, ${p0.x} ${p0[yField]}`;
         }
      return path;
   }

}

LineGraph.prototype.xAxis = "x";
LineGraph.prototype.yAxis = "y";
LineGraph.prototype.area = false;
LineGraph.prototype.line = true;

LineGraph.prototype.xField = "x";
LineGraph.prototype.yField = "y";
LineGraph.prototype.baseClass = "linegraph";
LineGraph.prototype.y0 = 0;
LineGraph.prototype.y0Field = false;
LineGraph.prototype.active = true;
LineGraph.prototype.legend = "legend";
LineGraph.prototype.legendAction = "auto";
LineGraph.prototype.legendShape = "rect";
LineGraph.prototype.stack = "stack";
LineGraph.prototype.hiddenBase = false;

LineGraph.prototype.smooth = false;
LineGraph.prototype.styled = true;

Widget.alias("line-graph", LineGraph);
