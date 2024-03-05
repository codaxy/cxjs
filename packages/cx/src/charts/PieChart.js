import { Widget, VDOM } from "../ui/Widget";
import { Container } from "../ui/Container";
import { BoundedObject } from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { Selection } from "../ui/selection/Selection";
import { tooltipMouseMove, tooltipMouseLeave } from "../widgets/overlay/tooltip-ops";
import { isNumber } from "../util/isNumber";
import { shallowEquals } from "../util/shallowEquals";
import { withHoverSync } from "../ui/HoverSync";

export class PieChart extends BoundedObject {
   declareData() {
      super.declareData(...arguments, {
         angle: undefined,
         startAngle: 0,
         clockwise: undefined,
         // gap: 0,
         innerGapAngle: 0,
         outerGapAngle: 0,
      });
   }

   explore(context, instance) {
      if (!instance.pie) instance.pie = new PieCalculator();
      var { data } = instance;
      instance.pie.reset(data.angle, data.startAngle, data.clockwise, data.innerGapAngle, data.outerGapAngle);

      context.push("pie", instance.pie);
      super.explore(context, instance);
   }

   exploreCleanup(context, instance) {
      context.pop("pie");
   }

   prepare(context, instance) {
      this.prepareBounds(context, instance);
      var { data, pie } = instance;
      pie.measure(data.bounds);
      let hash = pie.hash();
      instance.cache("hash", hash);
      pie.shouldUpdate = !shallowEquals(hash, instance.cached.hash);
      if (!pie.shouldUpdate) instance.markShouldUpdate(context);
      super.prepare(context, instance);
   }
}

PieChart.prototype.anchors = "0 1 1 0";

class PieCalculator {
   reset(angle, startAngle, clockwise, innerGapAngle, outerGapAngle) {
      this.angleTotal = (angle / 180) * Math.PI;
      this.startAngle = (startAngle / 180) * Math.PI;
      this.clockwise = clockwise;
      // this.gap = gap;
      this.innerGapAngle = (innerGapAngle / 180) * Math.PI;
      this.outerGapAngle = (outerGapAngle / 180) * Math.PI;
      this.stacks = {};
   }

   acknowledge(stack, value) {
      var s = this.stacks[stack];
      if (!s) s = this.stacks[stack] = { total: 0, totalInnerGapAngle: 0, totalOuterGapAngle: 0 };
      if (value > 0) {
         s.total += value;
         s.totalInnerGapAngle += this.innerGapAngle;
         s.totalOuterGapAngle += this.outerGapAngle;
      }
   }

   hash() {
      return {
         angleTotal: this.angleTotal,
         startAngle: this.startAngle,
         clockwise: this.clockwise,
         stacks: Object.keys(this.stacks)
            .map((s) => `${this.stacks[s].innerAngleFactor}_${this.stacks[s].outerAngleFactor}`)
            .join(":"),
         cx: this.cx,
         cy: this.cy,
         R: this.R,
         // gap: this.gap,
         innerGapAngle: this.innerGapAngle,
         outerGapAngle: this.outerGapAngle,
      };
   }

   measure(rect) {
      for (let s in this.stacks) {
         let stack = this.stacks[s];
         stack.innerAngleFactor = stack.total > 0 ? (this.angleTotal - stack.totalInnerGapAngle) / stack.total : 0;
         stack.outerAngleFactor = stack.total > 0 ? (this.angleTotal - stack.totalOuterGapAngle) / stack.total : 0;
         stack.lastInnerAngle = this.startAngle;
         stack.lastOuterAngle = this.startAngle;
      }
      this.cx = (rect.l + rect.r) / 2;
      this.cy = (rect.t + rect.b) / 2;
      this.R = Math.max(0, Math.min(rect.width(), rect.height())) / 2;
   }

   map(stack, value, innerGapAngle, outerGapAngle) {
      debugger;
      let s = this.stacks[stack];

      let innerAngle = value * s.innerAngleFactor;
      let outerAngle = value * s.outerAngleFactor;
      let startInnerAngle = s.lastInnerAngle + innerGapAngle / 2;
      let startOuterAngle = s.lastOuterAngle + outerGapAngle / 2;
      let endInnerAngle = !this.clockwise ? startInnerAngle + innerAngle : startInnerAngle - innerAngle;
      let endOuterAngle = !this.clockwise ? startOuterAngle + outerAngle : startOuterAngle - outerAngle;

      s.lastInnerAngle += endInnerAngle + innerGapAngle / 2;
      s.lastOuterAngle += endOuterAngle + outerGapAngle / 2;

      return {
         startInnerAngle,
         endInnerAngle,
         midAngle: (startOuterAngle + endOuterAngle) / 2,
         startOuterAngle,
         endOuterAngle,
         cx: this.cx,
         cy: this.cy,
         R: this.R,
      };
   }
}

function createSvgArc(x, y, r0, r, startInnerAngle, endInnerAngle, startOuterAngle, endOuterAngle) {
   console.log("startInnerAngle", startInnerAngle);
   console.log("endInnerAngle", endInnerAngle);
   console.log("startOuterAngle", startOuterAngle);
   console.log("endOuterAngle", endOuterAngle);

   if (startInnerAngle > endInnerAngle) {
      let s = startInnerAngle;
      startInnerAngle = endInnerAngle;
      endInnerAngle = s;
   }
   if (startOuterAngle > endOuterAngle) {
      let s = startOuterAngle;
      startOuterAngle = endOuterAngle;
      endOuterAngle = s;
   }

   // console.log("Total inner angle radian: ", endInnerAngle - startInnerAngle);
   // console.log("Total inner angle: ", ((endInnerAngle - startInnerAngle) / Math.PI) * 180);
   // console.log("Total outer angle radian: ", endOuterAngle - startOuterAngle);
   // console.log("Total outer angle: ", ((endOuterAngle - startOuterAngle) / Math.PI) * 180);

   if (endInnerAngle - startInnerAngle >= 2 * Math.PI - 0.0001) endInnerAngle = startInnerAngle + 2 * Math.PI - 0.0001;
   if (endOuterAngle - startOuterAngle >= 2 * Math.PI - 0.0001) endOuterAngle = startOuterAngle + 2 * Math.PI - 0.0001;

   var result = [];

   var startX, startY;

   if (r0 > 0) {
      startX = x + Math.cos(endInnerAngle) * r0;
      startY = y - Math.sin(endInnerAngle) * r0;
      result.push("M", startX, startY);

      result.push(
         "A",
         r0,
         r0,
         0,
         endInnerAngle - startInnerAngle <= Math.PI ? 0 : 1,
         1,
         x + Math.cos(startInnerAngle) * r0,
         y - Math.sin(startInnerAngle) * r0
      );
   } else {
      startX = x;
      startY = y;
      result.push("M", startX, startY);
   }

   result.push(
      "L",
      x + Math.cos(startOuterAngle) * r,
      y - Math.sin(startOuterAngle) * r,
      "A",
      r,
      r,
      0,
      endOuterAngle - startOuterAngle <= Math.PI ? 0 : 1,
      0,
      x + Math.cos(endOuterAngle) * r,
      y - Math.sin(endOuterAngle) * r,
      "L",
      startX,
      startY
   );
   return result.join(" ");
}

PieChart.prototype.anchors = "0 1 1 0";
PieChart.prototype.angle = 360;

Widget.alias("pie-slice");
export class PieSlice extends Container {
   init() {
      this.selection = Selection.create(this.selection);
      super.init();
   }

   declareData() {
      var selection = this.selection.configureWidget(this);
      super.declareData(...arguments, selection, {
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
      });
   }

   prepareData(context, instance) {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context, instance) {
      instance.pie = context.pie;
      if (!instance.pie) throw new Error("Pie.Slice must be placed inside a Pie.");

      let { data } = instance;

      instance.valid = isNumber(data.value) && data.value > 0;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      instance.hoverSync = context.hoverSync;

      if (instance.valid && data.active) {
         instance.pie.acknowledge(data.stack, data.value);
         super.explore(context, instance);
      }
   }

   prepare(context, instance) {
      let { data, segment, pie, colorMap } = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }

      if (instance.valid && data.active) {
         let seg = pie.map(data.stack, data.value, instance.pie.innerGapAngle, instance.pie.outerGapAngle);

         if (
            !segment ||
            instance.shouldUpdate ||
            seg.startInnerAngle != segment.startInnerAngle ||
            seg.endInnerAngle != segment.endInnerAngle ||
            seg.startOuterAngle != segment.startOuterAngle ||
            seg.endOuterAngle != segment.endOuterAngle ||
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

            let ix = seg.ox + Math.cos(seg.midAngle) * innerR * seg.radiusMultiplier;
            let iy = seg.oy - Math.sin(seg.midAngle) * innerR * seg.radiusMultiplier;
            let ox = seg.ox + Math.cos(seg.midAngle) * outerR * seg.radiusMultiplier;
            let oy = seg.oy - Math.sin(seg.midAngle) * outerR * seg.radiusMultiplier;

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
            onClick: (e) => {
               this.onLegendClick(e, instance);
            },
         });
   }

   prepareCleanup(context, instance) {
      if (instance.valid && instance.data.active) {
         context.pop("parentRect");
      }
   }

   onLegendClick(e, instance) {
      var allActions = this.legendAction == "auto";
      var { data } = instance;
      if (allActions || this.legendAction == "toggle") if (instance.set("active", !data.active)) return;

      if (allActions || this.legendAction == "select") this.handleClick(e, instance);
   }

   render(context, instance, key) {
      var { segment, data, pie } = instance;
      if (!instance.valid || !data.active) return null;

      return withHoverSync(
         key,
         instance.hoverSync,
         this.hoverChannel,
         data.hoverId,
         ({ hover, onMouseMove, onMouseLeave }) => {
            var stateMods = {
               selected: this.selection.isInstanceSelected(instance),
               disabled: data.disabled,
               selectable: !this.selection.isDummy,
               [`color-${data.colorIndex}`]: data.colorIndex != null,
               hover,
            };

            var d = createSvgArc(
               segment.ox,
               segment.oy,
               data.r0 * segment.radiusMultiplier,
               data.r * segment.radiusMultiplier,
               segment.startInnerAngle,
               segment.endInnerAngle,
               segment.startOuterAngle,
               segment.endOuterAngle
               // pie.gap
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
         }
      );
   }

   handleClick(e, instance) {
      if (!this.selection.isDummy) {
         this.selection.selectInstance(instance, {
            toggle: e.ctrlKey,
         });
         e.stopPropagation();
         e.preventDefault();
      }
   }
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

Widget.alias("pie-chart", PieChart);
