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
         gap: 0,
      });
   }

   explore(context, instance) {
      if (!instance.pie) instance.pie = new PieCalculator();
      var { data } = instance;
      instance.pie.reset(data.angle, data.startAngle, data.clockwise, data.gap);

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
   reset(angle, startAngle, clockwise, gap) {
      this.angleTotal = (angle / 180) * Math.PI;
      this.startAngle = (startAngle / 180) * Math.PI;
      this.clockwise = clockwise;
      this.gap = gap;
      this.stacks = {};
   }

   acknowledge(stack, value) {
      var s = this.stacks[stack];
      if (!s) s = this.stacks[stack] = { total: 0 };
      if (value > 0) s.total += value;
   }

   hash() {
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

   measure(rect) {
      for (var s in this.stacks) {
         var stack = this.stacks[s];
         stack.angleFactor = stack.total > 0 ? this.angleTotal / stack.total : 0;
         stack.lastAngle = this.startAngle;
      }
      this.cx = (rect.l + rect.r) / 2;
      this.cy = (rect.t + rect.b) / 2;
      this.R = Math.max(0, Math.min(rect.width(), rect.height())) / 2;
   }

   map(stack, value) {
      var s = this.stacks[stack];
      var angle = value * s.angleFactor;
      var startAngle = s.lastAngle;

      if (!this.clockwise) s.lastAngle += angle;
      else s.lastAngle -= angle;

      return {
         startAngle,
         endAngle: s.lastAngle,
         midAngle: (startAngle + s.lastAngle) / 2,
         cx: this.cx,
         cy: this.cy,
         R: this.R,
      };
   }
}

function createSvgArc(x, y, r0, r, startAngle, endAngle, gap = 0) {
   if (gap && (!r0 || gap > r0 / 2)) r0 = gap * 2;

   if (startAngle > endAngle) {
      var s = startAngle;
      startAngle = endAngle;
      endAngle = s;
   }

   if (endAngle - startAngle >= 2 * Math.PI - 0.0001) endAngle = startAngle + 2 * Math.PI - 0.0001;

   var result = [];

   var startX, startY;

   if (r0 > 0) {
      let innerGapAngle = Math.asin(gap / (2 * r0));

      startX = x + Math.cos(endAngle - innerGapAngle) * r0;
      startY = y - Math.sin(endAngle - innerGapAngle) * r0;
      result.push("M", startX, startY);

      result.push(
         "A",
         r0,
         r0,
         0,
         endAngle - startAngle - 2 * innerGapAngle <= Math.PI ? 0 : 1,
         1,
         x + Math.cos(startAngle + innerGapAngle) * r0,
         y - Math.sin(startAngle + innerGapAngle) * r0
      );
   } else {
      startX = x;
      startY = y;
      result.push("M", startX, startY);
   }

   // if gap is defined, outerGapAngle will be different from 0 and affect start and end angles
   let outerGapAngle = Math.asin(gap / (2 * r));
   result.push(
      "L",
      x + Math.cos(startAngle + outerGapAngle) * r,
      y - Math.sin(startAngle + outerGapAngle) * r,
      "A",
      r,
      r,
      0,
      endAngle - startAngle - 2 * outerGapAngle <= Math.PI ? 0 : 1,
      0,
      x + Math.cos(endAngle - outerGapAngle) * r,
      y - Math.sin(endAngle - outerGapAngle) * r,
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
         let seg = pie.map(data.stack, data.value);

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
               segment.startAngle,
               segment.endAngle,
               pie.gap
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
