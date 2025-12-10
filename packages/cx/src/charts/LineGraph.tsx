/** @jsxImportSource react */

import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import { isArray } from "../util/isArray";
import { parseStyle } from "../util/parseStyle";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp, StringProp, RecordsProp, StyleProp } from "../ui/Prop";
import type { ChartRenderingContext } from "./Chart";
import { ClassProp } from "../core";

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

   /** Set to `true` to enable smooth (curved) line rendering. */
   smooth?: BooleanProp;

   /** Controls the curvature of smooth lines. Value should be between 0 and 0.4. Default is 0.05. */
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
   declare smoothingRatio: number;

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
         smoothingRatio: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: LineGraphInstance): void {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      if (data.smooth && data.smoothingRatio != null) {
         if (data.smoothingRatio < 0) data.smoothingRatio = 0;
         if (data.smoothingRatio > 0.4) data.smoothingRatio = 0.4;
      }

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
      const r = data.smoothingRatio;

      let linePath = "";
      if (data.line) {
         lineSpans.forEach((span) => {
            span.forEach((p, i) => {
               linePath +=
                  i == 0
                     ? `M ${p.x} ${p.y}`
                     : !data.smooth || span.length < 2
                       ? `L ${p.x} ${p.y}`
                       : this.getCurvedPathSegment(p, span, i - 1, i - 2, i - 1, i + 1, r);
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
            let closePath = "";
            span.forEach((p, i) => {
               let segment = "";
               if (i == 0) {
                  segment = `M ${p.x} ${p.y}`;

                  // closing point
                  closePath =
                     !data.smooth || span.length < 2
                        ? `L ${p.x} ${p.y0}`
                        : this.getCurvedPathSegment(p, span, i + 1, i + 2, i + 1, i - 1, r, "y0");
               } else {
                  if (!data.smooth) {
                     segment = `L ${p.x} ${p.y}`;
                     closePath = `L ${p.x} ${p.y0}` + closePath;
                  } else {
                     segment = this.getCurvedPathSegment(p, span, i - 1, i - 2, i - 1, i + 1, r, "y");

                     // closing point
                     if (i < span.length - 1)
                        closePath = this.getCurvedPathSegment(p, span, i + 1, i + 2, i + 1, i - 1, r, "y0") + closePath;
                  }
               }
               areaPath += segment;
            });

            areaPath += `L ${span[span.length - 1].x} ${span[span.length - 1].y0}`;
            areaPath += closePath;
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

   getCurvedPathSegment(
      p: LinePoint,
      points: LinePoint[],
      i1: number,
      i2: number,
      j1: number,
      j2: number,
      r: number,
      yField: "y" | "y0" = "y",
   ): string {
      const [sx, sy] = this.getControlPoint({ cp: points[i1], pp: points[i2], r, np: p, yField });
      const [ex, ey] = this.getControlPoint({ cp: p, pp: points[j1], np: points[j2], r, reverse: true, yField });

      return `C ${sx} ${sy}, ${ex} ${ey}, ${p.x} ${p[yField]}`;
   }

   getControlPoint({
      cp,
      pp,
      np,
      r,
      reverse,
      yField = "y",
   }: {
      cp: LinePoint;
      pp: LinePoint | undefined;
      np: LinePoint | undefined;
      r: number;
      reverse?: boolean;
      yField?: "y" | "y0";
   }): [number, number] {
      // When 'current' is the first or last point of the array 'previous' or 'next' don't exist. Replace with 'current'.
      const p = pp || cp;
      const n = np || cp;

      // Properties of the opposed-line
      let { angle, length } = this.getLineInfo(p.x, p[yField], n.x, n[yField]);
      // If it is end-control-point, add PI to the angle to go backward
      angle = angle + (reverse ? Math.PI : 0);
      length = length * r;
      // The control point position is relative to the current point
      const x = cp.x + Math.cos(angle) * length;
      const y = cp[yField] + Math.sin(angle) * length;
      return [x, y];
   }

   getLineInfo(p1x: number, p1y: number, p2x: number, p2y: number): { length: number; angle: number } {
      const lengthX = p2x - p1x;
      const lengthY = p2y - p1y;

      return {
         length: Math.sqrt(Math.pow(lengthX, 2) + Math.pow(lengthY, 2)),
         angle: Math.atan2(lengthY, lengthX),
      };
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
LineGraph.prototype.smoothingRatio = 0.05;
LineGraph.prototype.styled = true;

Widget.alias("line-graph", LineGraph);
