/** @jsxImportSource react */

import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import { Container, ContainerConfig, StyledContainerConfig } from "../ui/Container";
import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { Selection, SimpleSelection } from "../ui/selection/Selection";
import type { KeySelection } from "../ui/selection/KeySelection";
import type { PropertySelection } from "../ui/selection/PropertySelection";
import { tooltipMouseMove, tooltipMouseLeave, TooltipParentInstance } from "../widgets/overlay/tooltip-ops";
import { isNumber } from "../util/isNumber";
import { shallowEquals } from "../util/shallowEquals";
import { withHoverSync } from "../ui/HoverSync";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp, StringProp } from "../ui/Prop";
import { CreateConfig } from "../util/Component";

export interface PieChartConfig extends BoundedObjectConfig {
   /** Total angle of the pie chart in degrees. Default is `360`. */
   angle?: NumberProp;

   /** Starting angle in degrees. Default is `0`. */
   startAngle?: NumberProp;

   /** Set to `true` for clockwise direction. */
   clockwise?: BooleanProp;

   /** Gap between slices in pixels. Default is `0`. */
   gap?: NumberProp;
}

export interface PieChartInstance extends BoundedObjectInstance {
   pie: PieCalculator;
}

export class PieChart extends BoundedObject {
   declare angle: number;
   declare startAngle: number;
   declare gap: number;

   constructor(config: PieChartConfig) {
      super(config);
   }

   declareData(...args: any[]): void {
      super.declareData(...args, {
         angle: undefined,
         startAngle: undefined,
         clockwise: undefined,
         gap: undefined,
      });
   }

   explore(context: RenderingContext, instance: PieChartInstance): void {
      if (!instance.pie) instance.pie = new PieCalculator();
      let { data } = instance;
      instance.pie.reset(data.angle, data.startAngle, data.clockwise, data.gap);

      context.push("pie", instance.pie);
      super.explore(context, instance);
   }

   exploreCleanup(context: RenderingContext, instance: PieChartInstance): void {
      context.pop("pie");
   }

   prepare(context: RenderingContext, instance: PieChartInstance): void {
      this.prepareBounds(context, instance);
      let { data, pie } = instance;
      pie.measure(data.bounds);
      let hash = pie.hash();
      instance.cache("hash", hash);
      pie.shouldUpdate = !shallowEquals(hash, instance.cached.hash);
      if (!pie.shouldUpdate) instance.markShouldUpdate(context);
      super.prepare(context, instance);
   }
}

PieChart.prototype.anchors = "0 1 1 0";

interface PieStack {
   total: number;
   r0s: number[] | null;
   r0ps: number[] | null;
   gap: number;
   angleFactor: number;
   lastAngle: number;
}

export interface PieSegment {
   startAngle: number;
   endAngle: number;
   angle: number;
   midAngle: number;
   gap: number;
   cx: number;
   cy: number;
   R: number;
   ox?: number;
   oy?: number;
   radiusMultiplier?: number;
}

class PieCalculator {
   angleTotal: number = 0;
   startAngle: number = 0;
   clockwise: boolean = false;
   gap: number = 0;
   stacks: Record<string, PieStack> = {};
   cx: number = 0;
   cy: number = 0;
   R: number = 0;
   shouldUpdate: boolean = false;

   reset(angle: number, startAngle: number, clockwise: boolean, gap: number): void {
      if (angle == 360) angle = 359.99; // really hacky way to draw full circles
      this.angleTotal = (angle / 180) * Math.PI;
      this.startAngle = (startAngle / 180) * Math.PI;
      this.clockwise = clockwise;
      this.gap = gap;
      this.stacks = {};
   }

   acknowledge(stack: string, value: number, r: number, r0: number, percentageRadius: boolean): void {
      let s = this.stacks[stack];
      if (!s)
         s = this.stacks[stack] = {
            total: 0,
            r0s: this.gap > 0 ? [] : null,
            r0ps: this.gap > 0 ? [] : null,
            gap: 0,
            angleFactor: 0,
            lastAngle: 0,
         };
      if (value > 0) {
         s.total += value;
         if (this.gap > 0 && r0 > 0)
            if (percentageRadius) s.r0ps!.push(r0);
            else s.r0s!.push(r0);
      }
   }

   hash(): Record<string, any> {
      return {
         angleTotal: this.angleTotal,
         startAngle: this.startAngle,
         clockwise: this.clockwise,
         stacks: Object.keys(this.stacks)
            .map((s) => `${this.stacks[s].angleFactor}`)
            .join(":"),
         cx: this.cx,
         cy: this.cy,
         R: this.R,
         gap: this.gap,
      };
   }

   measure(rect: Rect): void {
      this.R = Math.max(0, Math.min(rect.width(), rect.height())) / 2;
      for (let s in this.stacks) {
         let stack = this.stacks[s];
         let gapAngleTotal = 0;
         stack.gap = this.gap;
         if (this.gap > 0) {
            // gap cannot be larger of two times the smallest r0
            for (let index = 0; index < stack.r0s!.length; index++)
               if (2 * stack.r0s![index] < stack.gap) stack.gap = 2 * stack.r0s![index];
            for (let index = 0; index < stack.r0ps!.length; index++) {
               let r0 = (stack.r0ps![index] * this.R) / 100;
               if (2 * r0 < stack.gap) stack.gap = 2 * r0;
            }
         }
         while (stack.gap > 0) {
            for (let index = 0; index < stack.r0s!.length; index++)
               gapAngleTotal += 2 * Math.asin(stack.gap / stack.r0s![index] / 2);

            for (let index = 0; index < stack.r0ps!.length; index++)
               gapAngleTotal += 2 * Math.asin(stack.gap / ((stack.r0ps![index] * this.R) / 100) / 2);

            if (gapAngleTotal < 0.25 * this.angleTotal) break;
            stack.gap = stack.gap * 0.95;
            gapAngleTotal = 0;
         }
         if (gapAngleTotal == 0) stack.gap = 0;
         stack.angleFactor = stack.total > 0 ? (this.angleTotal - gapAngleTotal) / stack.total : 0;
         stack.lastAngle = this.startAngle;
      }
      this.cx = (rect.l + rect.r) / 2;
      this.cy = (rect.t + rect.b) / 2;
   }

   map(stack: string, value: number, r: number, r0: number, percentageRadius: boolean): PieSegment {
      if (percentageRadius) {
         r = (r * this.R) / 100;
         r0 = (r0 * this.R) / 100;
      }
      let s = this.stacks[stack];
      let angle = value * s.angleFactor;
      let startAngle = s.lastAngle;
      let clockFactor = this.clockwise ? -1 : 1;
      let gapAngle = r0 > 0 && s.gap > 0 ? 2 * Math.asin(s.gap / r0 / 2) : 0;
      s.lastAngle += clockFactor * (angle + gapAngle);
      let endAngle = startAngle + clockFactor * (angle + gapAngle);

      return {
         startAngle,
         endAngle: startAngle + clockFactor * (angle + gapAngle),
         angle,
         midAngle: (startAngle + endAngle) / 2,
         gap: s.gap,
         cx: this.cx,
         cy: this.cy,
         R: this.R,
      };
   }
}

function createSvgArc(
   cx: number,
   cy: number,
   r0: number = 0,
   r: number,
   startAngle: number,
   endAngle: number,
   br: number = 0,
   gap: number = 0,
): string {
   let gap2 = gap / 2;

   if (startAngle > endAngle) {
      let s = startAngle;
      startAngle = endAngle;
      endAngle = s;
   }

   let path = [];
   // limit br size based on r and r0
   if (br > (r - r0) / 2) br = (r - r0) / 2;

   if (br > 0) {
      if (r0 > 0) {
         let innerBr = br;
         let innerSmallArcAngle = Math.asin((br + gap2) / (r0 + br));

         // adjust br according to the available area
         if (innerSmallArcAngle > (endAngle - startAngle) / 2) {
            innerSmallArcAngle = (endAngle - startAngle) / 2;
            let sin = Math.sin(innerSmallArcAngle);
            innerBr = Math.max((r0 * sin - gap2) / (1 - sin), 0);
         }

         let innerHipDiagonal = (r0 + innerBr) * Math.cos(innerSmallArcAngle);

         let innerSmallArc1XFrom = cx + Math.cos(endAngle) * innerHipDiagonal + Math.cos(endAngle - Math.PI / 2) * gap2;
         let innerSmallArc1YFrom = cy - Math.sin(endAngle) * innerHipDiagonal - Math.sin(endAngle - Math.PI / 2) * gap2;

         // move from the first small inner arc
         path.push(move(innerSmallArc1XFrom, innerSmallArc1YFrom));

         let innerSmallArc1XTo = cx + Math.cos(endAngle - innerSmallArcAngle) * r0;
         let innerSmallArc1YTo = cy - Math.sin(endAngle - innerSmallArcAngle) * r0;

         // add first small inner arc
         path.push(arc(innerBr, innerBr, 0, 0, 0, innerSmallArc1XTo, innerSmallArc1YTo));

         // SECOND ARC

         let innerArcXTo = cx + Math.cos(startAngle + innerSmallArcAngle) * r0;
         let innerArcYTo = cy - Math.sin(startAngle + innerSmallArcAngle) * r0;
         // add large inner arc
         path.push(
            arc(
               r0,
               r0,
               0,
               largeArcFlag(endAngle - innerSmallArcAngle - startAngle - innerSmallArcAngle),
               1,
               innerArcXTo,
               innerArcYTo,
            ),
         );

         let innerSmallArc2XTo =
            cx + Math.cos(startAngle) * innerHipDiagonal + Math.cos(startAngle + Math.PI / 2) * gap2;
         let innerSmallArc2YTo =
            cy - Math.sin(startAngle) * innerHipDiagonal - Math.sin(startAngle + Math.PI / 2) * gap2;
         // add second small inner arc
         path.push(arc(innerBr, innerBr, 0, 0, 0, innerSmallArc2XTo, innerSmallArc2YTo));
      } else {
         path.push(move(cx, cy));
      }

      let outerBr = br;
      let outerSmallArcAngle = Math.asin((br + gap2) / (r - br));

      // tweak br according to the available area
      if (outerSmallArcAngle > (endAngle - startAngle) / 2) {
         outerSmallArcAngle = (endAngle - startAngle) / 2;
         let sin = Math.sin(outerSmallArcAngle);
         outerBr = Math.max((r * sin - gap2) / (1 + sin), 0);
      }

      let outerHipDiagonal = Math.cos(outerSmallArcAngle) * (r - outerBr);

      let outerSmallArc1XFrom =
         cx + Math.cos(startAngle) * outerHipDiagonal + Math.cos(startAngle + Math.PI / 2) * gap2;
      let outerSmallArc1YFrom =
         cy - Math.sin(startAngle) * outerHipDiagonal - Math.sin(startAngle + Math.PI / 2) * gap2;

      let outerSmallArc1XTo = cx + Math.cos(startAngle + outerSmallArcAngle) * r;
      let outerSmallArc1YTo = cy - Math.sin(startAngle + outerSmallArcAngle) * r;

      let outerLargeArcXTo = cx + Math.cos(endAngle - outerSmallArcAngle) * r;
      let outerLargeArcYTo = cy - Math.sin(endAngle - outerSmallArcAngle) * r;

      let outerSmallArc2XTo = cx + Math.cos(endAngle) * outerHipDiagonal + Math.cos(endAngle - Math.PI / 2) * gap2;
      let outerSmallArc2YTo = cy - Math.sin(endAngle) * outerHipDiagonal - Math.sin(endAngle - Math.PI / 2) * gap2;

      path.push(
         line(outerSmallArc1XFrom, outerSmallArc1YFrom),
         arc(outerBr, outerBr, 0, 0, 0, outerSmallArc1XTo, outerSmallArc1YTo),
         arc(
            r,
            r,
            0,
            largeArcFlag(endAngle - outerSmallArcAngle - startAngle - outerSmallArcAngle),
            0,
            outerLargeArcXTo,
            outerLargeArcYTo,
         ),
         arc(outerBr, outerBr, 0, 0, 0, outerSmallArc2XTo, outerSmallArc2YTo),
      );
   } else {
      if (r0 > 0) {
         let innerGapAngle = r0 > 0 && gap2 > 0 ? Math.asin(gap2 / r0) : 0;
         let innerStartAngle = startAngle + innerGapAngle;
         let innerEndAngle = endAngle - innerGapAngle;
         let startX = cx + Math.cos(innerEndAngle) * r0;
         let startY = cy - Math.sin(innerEndAngle) * r0;
         path.push(move(startX, startY));

         let innerArcToX = cx + Math.cos(innerStartAngle) * r0;
         let innerArcToY = cy - Math.sin(innerStartAngle) * r0;

         path.push(arc(r0, r0, 0, largeArcFlag(innerStartAngle - innerEndAngle), 1, innerArcToX, innerArcToY));
      } else {
         path.push(move(cx, cy));
      }

      let outerGapAngle = r > 0 && gap2 > 0 ? Math.asin(gap2 / r) : 0;
      let outerStartAngle = startAngle + outerGapAngle;
      let outerEndAngle = endAngle - outerGapAngle;
      let lineToX = cx + Math.cos(outerStartAngle) * r;
      let lineToY = cy - Math.sin(outerStartAngle) * r;
      path.push(line(lineToX, lineToY));

      let arcToX = cx + Math.cos(outerEndAngle) * r;
      let arcToY = cy - Math.sin(outerEndAngle) * r;
      path.push(arc(r, r, 0, largeArcFlag(outerEndAngle - outerStartAngle), 0, arcToX, arcToY));
   }

   path.push(z());
   return path.join(" ");
}

PieChart.prototype.anchors = "0 1 1 0";
PieChart.prototype.angle = 360;
PieChart.prototype.startAngle = 0;
PieChart.prototype.gap = 0;

export interface PieSliceConfig extends StyledContainerConfig {
   /** Used to indicate if a slice is active or not. Inactive slices are not rendered. */
   active?: BooleanProp;

   /** Inner radius of the slice. Default is `0`. */
   r0?: NumberProp;

   /** Outer radius of the slice. Default is `50`. */
   r?: NumberProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: NumberProp;

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: StringProp;

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: StringProp;

   /** Offset of the slice from the center. */
   offset?: NumberProp;

   /** Value represented by the slice. */
   value?: NumberProp;

   /** Set to `true` to disable the slice. */
   disabled?: BooleanProp;

   /** Inner radius for point calculations. */
   innerPointRadius?: NumberProp;

   /** Outer radius for point calculations. */
   outerPointRadius?: NumberProp;

   /** Name of the item as it will appear in the legend. */
   name?: StringProp;

   /** Stack name. Default is `stack`. */
   stack?: StringProp;

   /** Name of the legend to be used. Default is `legend`. Set to `false` to hide the legend entry. */
   legend?: StringProp;

   /** ID used for hover synchronization. */
   hoverId?: StringProp;

   /** Border radius for rounded corners. */
   br?: NumberProp;

   /** Alias for br (border radius). */
   borderRadius?: number;

   /** Text to display in the legend. */
   legendDisplayText?: StringProp;

   /** Set to `true` to use percentage-based radius. Default is `true`. */
   percentageRadius?: boolean;

   /** Shape to use in legend. Default is `circle`. */
   legendShape?: string;

   /** Action to perform on legend item click. Default is `auto`. */
   legendAction?: string;

   /** Hover channel for hover synchronization. Default is `default`. */
   hoverChannel?: string;

   /** Selection configuration. */
   selection?: CreateConfig<typeof Selection> | CreateConfig<typeof KeySelection> | CreateConfig<typeof PropertySelection> | CreateConfig<typeof SimpleSelection>;

   /** Tooltip configuration. */
   tooltip?: any;
}

export interface PieSliceInstance extends Instance, TooltipParentInstance {
   pie: PieCalculator;
   valid: boolean;
   colorMap: any;
   hoverSync: any;
   segment: PieSegment;
   bounds: Rect;
}

Widget.alias("pie-slice");
export class PieSlice extends Container {
   declare baseClass: string;
   declare offset: number;
   declare r0: number;
   declare r: number;
   declare percentageRadius: boolean;
   declare legend: string;
   declare active: boolean;
   declare stack: string;
   declare legendAction: string;
   declare legendShape: string;
   declare hoverChannel: string;
   declare br: number;
   declare borderRadius: number;
   declare selection: Selection;
   declare tooltip: any;

   constructor(config: PieSliceConfig) {
      super(config);
   }

   init(): void {
      this.selection = Selection.create(this.selection);
      if (this.borderRadius) this.br = this.borderRadius;
      super.init();
   }

   declareData(...args: any[]): void {
      let selection = this.selection.configureWidget(this);
      super.declareData(...args, selection, {
         active: true,
         r0: undefined,
         r: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         colorName: undefined,
         offset: undefined,
         value: undefined,
         disabled: undefined,
         innerPointRadius: undefined,
         outerPointRadius: undefined,
         name: undefined,
         stack: undefined,
         legend: undefined,
         hoverId: undefined,
         br: undefined,
         legendDisplayText: undefined,
      });
   }

   prepareData(context: RenderingContext, instance: PieSliceInstance): void {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context: RenderingContext, instance: PieSliceInstance): void {
      instance.pie = context.pie;
      if (!instance.pie) throw new Error("Pie.Slice must be placed inside a Pie.");

      let { data } = instance;

      instance.valid = isNumber(data.value) && data.value > 0;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      instance.hoverSync = context.hoverSync;

      if (instance.valid && data.active) {
         instance.pie.acknowledge(data.stack, data.value, data.r, data.r0, this.percentageRadius);
         super.explore(context, instance);
      }
   }

   prepare(context: RenderingContext, instance: PieSliceInstance): void {
      let { data, segment, pie, colorMap } = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }

      if (instance.valid && data.active) {
         let seg = pie.map(data.stack, data.value, data.r, data.r0, this.percentageRadius);

         if (
            !segment ||
            instance.shouldUpdate ||
            seg.startAngle != segment.startAngle ||
            seg.endAngle != segment.endAngle ||
            pie.shouldUpdate
         ) {
            if (data.offset > 0) {
               seg.ox = seg.cx + Math.cos(seg.midAngle) * data.offset;
               seg.oy = seg.cy - Math.sin(seg.midAngle) * data.offset;
            } else {
               seg.ox = seg.cx;
               seg.oy = seg.cy;
            }

            seg.radiusMultiplier = 1;
            if (this.percentageRadius) seg.radiusMultiplier = seg.R / 100;

            let innerR = data.innerPointRadius != null ? data.innerPointRadius : data.r0;
            let outerR = data.outerPointRadius != null ? data.outerPointRadius : data.r;

            let ix = seg.ox! + Math.cos(seg.midAngle) * innerR * seg.radiusMultiplier;
            let iy = seg.oy! - Math.sin(seg.midAngle) * innerR * seg.radiusMultiplier;
            let ox = seg.ox! + Math.cos(seg.midAngle) * outerR * seg.radiusMultiplier;
            let oy = seg.oy! - Math.sin(seg.midAngle) * outerR * seg.radiusMultiplier;

            instance.segment = seg;
            instance.bounds = new Rect({
               l: ix,
               r: ox,
               t: iy,
               b: oy,
            });

            instance.markShouldUpdate(context);
         }

         context.push("parentRect", instance.bounds);
      }

      if (data.name && data.legend && context.addLegendEntry)
         context.addLegendEntry(data.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            selected: this.selection.isInstanceSelected(instance),
            style: data.style,
            shape: this.legendShape,
            hoverId: data.hoverId,
            hoverChannel: this.hoverChannel,
            hoverSync: instance.hoverSync,
            displayText: data.legendDisplayText,
            value: data.value,
            onClick: (e: MouseEvent) => {
               this.onLegendClick(e, instance);
            },
         });
   }

   prepareCleanup(context: RenderingContext, instance: PieSliceInstance): void {
      if (instance.valid && instance.data.active) {
         context.pop("parentRect");
      }
   }

   onLegendClick(e: MouseEvent | React.MouseEvent, instance: PieSliceInstance): void {
      let allActions = this.legendAction == "auto";
      let { data } = instance;
      if (allActions || this.legendAction == "toggle") if (instance.set("active", !data.active)) return;

      if (allActions || this.legendAction == "select") this.handleClick(e as React.MouseEvent, instance);
   }

   render(context: RenderingContext, instance: PieSliceInstance, key: string): React.ReactNode {
      let { segment, data } = instance;
      if (!instance.valid || !data.active) return null;

      return withHoverSync(
         key,
         instance.hoverSync,
         this.hoverChannel,
         data.hoverId,
         ({ hover, onMouseMove, onMouseLeave }) => {
            let stateMods: Record<string, any> = {
               selected: this.selection.isInstanceSelected(instance),
               disabled: data.disabled,
               selectable: !this.selection.isDummy,
               [`color-${data.colorIndex}`]: data.colorIndex != null,
               hover,
            };

            let d = createSvgArc(
               segment.ox!,
               segment.oy!,
               data.r0 * segment.radiusMultiplier!,
               data.r * segment.radiusMultiplier!,
               segment.startAngle,
               segment.endAngle,
               data.br,
               segment.gap,
            );

            return (
               <g key={key} className={data.classNames}>
                  <path
                     className={this.CSS.element(this.baseClass, "slice", stateMods)}
                     style={data.style}
                     d={d}
                     onMouseMove={(e) => {
                        onMouseMove(e, instance);
                        tooltipMouseMove(e, instance, this.tooltip);
                     }}
                     onMouseLeave={(e) => {
                        onMouseLeave(e, instance);
                        tooltipMouseLeave(e, instance, this.tooltip);
                     }}
                     onClick={(e) => {
                        this.handleClick(e, instance);
                     }}
                  />
                  {this.renderChildren(context, instance)}
               </g>
            );
         },
      );
   }

   handleClick(e: React.MouseEvent, instance: PieSliceInstance): void {
      if (!this.selection.isDummy) {
         this.selection.selectInstance(instance, {
            toggle: e.ctrlKey,
         });
         e.stopPropagation();
         e.preventDefault();
      }
   }
}

function move(x: number, y: number): string {
   return `M ${x} ${y}`;
}

function line(x: number, y: number): string {
   return `L ${x} ${y}`;
}

function z(): string {
   return "Z";
}

function arc(rx: number, ry: number, xRotation: number, largeArc: number, sweep: number, x: number, y: number): string {
   return `A ${rx} ${ry} ${xRotation} ${largeArc} ${sweep} ${x} ${y}`;
}

function largeArcFlag(angle: number): number {
   return angle > Math.PI || angle < -Math.PI ? 1 : 0;
}

PieSlice.prototype.offset = 0;
PieSlice.prototype.r0 = 0;
PieSlice.prototype.r = 50;
PieSlice.prototype.percentageRadius = true;
PieSlice.prototype.baseClass = "pieslice";
PieSlice.prototype.legend = "legend";
PieSlice.prototype.active = true;
PieSlice.prototype.stack = "stack";
PieSlice.prototype.legendAction = "auto";
PieSlice.prototype.legendShape = "circle";
PieSlice.prototype.hoverChannel = "default";
PieSlice.prototype.styled = true;
PieSlice.prototype.br = 0;

Widget.alias("pie-chart", PieChart);
