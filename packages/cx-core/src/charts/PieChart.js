import {Widget, VDOM} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {BoundedObject} from '../svg/BoundedObject';
import {Rect} from '../svg/util/Rect';
import {Selection} from '../ui/selection/Selection';
import {tooltipMouseMove, tooltipMouseLeave} from '../widgets/overlay/Tooltip';

export class PieChart extends BoundedObject {

   declareData() {
      super.declareData(...arguments, {
         angle: undefined
      });
   }

   explore(context, instance) {
      var pie = context.pie;
      if (!instance.pie)
         instance.pie = new PieCalculator();
      var {data} = instance;
      instance.pie.reset(data.angle);
      context.pie = instance.pie;
      super.explore(context, instance);
      context.pie = pie;
   }
   
   prepare(context, instance) {
      this.prepareBounds(context, instance);
      var {data, pie} = instance;
      pie.measure(data.bounds);
      if (pie.shouldUpdate)
         instance.shouldUpdate = true;
      super.prepare(context, instance);
   }
   
   cleanup(context, instance) {
      instance.pie.cleanup();
   }
}

PieChart.prototype.anchors = '0 1 1 0';

class PieCalculator {
   reset(angle) {
      this.angleTotal = angle / 180 * Math.PI;
      this.stacks = {};
   }

   acknowledge(stack, value) {
      var s = this.stacks[stack];
      if (!s)
         s = this.stacks[stack] = {total: 0};
      if (value > 0)
         s.total += value;
   }
   
   hash() {
      return {
         angleTotal: this.angleTotal,
         stacks: Object.keys(this.stacks).map(s=>`${this.stacks[s].angleFactor}`).join(':'),
         cx: this.cx,
         cy: this.cy,
         R: this.R
      }
   }

   cleanup() {
      this.oldHash = this.newHash;
   }
   
   measure(rect) {
      for (var s in this.stacks) {
         var stack = this.stacks[s];
         stack.angleFactor = stack.total > 0 ? this.angleTotal / stack.total : 0;
         stack.lastAngle = 0;
      }
      this.cx = (rect.l + rect.r) / 2;
      this.cy = (rect.t + rect.b) / 2;
      this.R = Math.max(0, Math.min(rect.width(), rect.height())) / 2;

      this.newHash = this.hash();
      this.shouldUpdate = !this.oldHash || Object.keys(this.newHash).some(k=>this.newHash[k] !== this.oldHash[k]);
   }
   
   map(stack, value) {
      var s = this.stacks[stack];
      var angle = value * s.angleFactor;
      var startAngle = s.lastAngle;
      s.lastAngle += angle;
      return {
         startAngle,
         endAngle: s.lastAngle,
         midAngle: (startAngle + s.lastAngle) / 2,
         cx: this.cx,
         cy: this.cy,
         R: this.R
      }
   }
}

function createSvgArc(x, y, r0, r, startAngle, endAngle) {
   if (startAngle > endAngle) {
      var s = startAngle;
      startAngle = endAngle;
      endAngle = s;
   }

   var largeArc = endAngle - startAngle <= Math.PI ? 0 : 1;

   if (endAngle - startAngle >= 2 * Math.PI)
      endAngle = startAngle + 2 * Math.PI - 0.0001;

   var result = [];

   var startX, startY;

   if (r0 > 0) {
      startX = x + Math.cos(endAngle) * r0;
      startY = y - Math.sin(endAngle) * r0;
      result.push('M', startX, startY);

      result.push(
         'A', r0, r0, 0, largeArc, 1, x + Math.cos(startAngle) * r0, y - Math.sin(startAngle) * r0,
      );
   }
   else {
      startX = x;
      startY = y;
      result.push('M', startX, startY);
   }

   result.push(
      'L', x + Math.cos(startAngle) * r, y - (Math.sin(startAngle) * r),
      'A', r, r, 0, largeArc, 0, x + Math.cos(endAngle) * r, y - Math.sin(endAngle) * r,
      'L', startX, startY
   );
   return result.join(' ');
}

PieChart.prototype.anchors = '0 1 1 0';
PieChart.prototype.angle = 360;

Widget.alias('pie-slice')
export class PieSlice extends PureContainer {
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
         class: {structured: true},
         className: {structured: true},
         style: {structured: true},
         colorIndex: undefined,
         colorMap: undefined,
         offset: undefined,
         value: undefined,
         disabled: undefined,
         tooltip: undefined,
         innerPointRadius: undefined,
         outerPointRadius: undefined,
         name: undefined,
         stack: undefined,
         legend: undefined
      });
   }

   explore(context, instance) {
      instance.pie = context.pie;
      if (!instance.pie)
         throw new Error('Pie.Slice must be placed inside a Pie.');

      let {data} = instance;

      instance.valid = typeof data.value == 'number' && data.value > 0;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.name)
         instance.colorMap.acknowledge(data.name);

      if (instance.valid && data.active) {
         instance.pie.acknowledge(data.stack, data.value);
         super.explore(context, instance);
      }
   }

   cleanup(context, instance) {
      let {data} = instance;
      if (instance.valid && data.active) {
         super.cleanup(context, instance);
      }
   }

   prepare(context, instance) {
      let {data, segment, pie, colorMap} = instance;

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.name);
         if (instance.colorIndex != data.colorIndex) {
            instance.colorIndex = data.colorIndex;
            instance.shouldUpdate = true;
         }
      }

      if (instance.valid && data.active) {
         let seg = pie.map(data.stack, data.value);

         if (!segment || instance.shouldUpdate || seg.startAngle != segment.startAngle || seg.endAngle != segment.endAngle || pie.shouldUpdate) {
            if (data.offset > 0) {
               seg.ox = seg.cx + Math.cos(seg.midAngle) * data.offset;
               seg.oy = seg.cy - Math.sin(seg.midAngle) * data.offset;
            } else {
               seg.ox = seg.cx;
               seg.oy = seg.cy;
            }

            seg.radiusMultiplier = 1;
            if (this.percentageRadius)
               seg.radiusMultiplier = seg.R / 100;

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
               b: oy
            });

            instance.shouldUpdate = true;
         }

         var pr = context.parentRect;
         context.parentRect = instance.bounds;
         super.prepare(context, instance);
         context.parentRect = pr;
      }

      if (data.name && data.legend && context.addLegendEntry)
         context.addLegendEntry(data.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            selected: this.selection.isInstanceSelected(instance),
            style: data.style,
            shape: 'rect',
            onClick: e=> { this.onLegendClick(e, instance) }
         });
   }

   onLegendClick(e, instance) {
      var allActions = this.legendAction == 'auto';
      var {data} = instance;
      if (allActions || this.legendAction == 'toggle')
         if (instance.set('active', !data.active))
            return;

      if (allActions || this.legendAction == 'select')
         this.handleClick(e, instance)
   }

   render(context, instance, key) {
      var {segment, data} = instance;
      if (!instance.valid || !data.active)
         return null;

      var stateMods = {
         selected: this.selection.isInstanceSelected(instance),
         disabled: data.disabled,
         selectable: !this.selection.isDummy,
         [`color-${data.colorIndex}`]: data.colorIndex != null
      };

      var d = createSvgArc(segment.ox, segment.oy, data.r0 * segment.radiusMultiplier, data.r * segment.radiusMultiplier, segment.startAngle, segment.endAngle);
      return <g key={key} className={data.classNames}>
         <path className={this.CSS.element(this.baseClass, 'slice', stateMods)}
            style={data.style}
            d={d}
            onMouseMove={e=>{tooltipMouseMove(e, instance)}}
            onMouseLeave={e=>{tooltipMouseLeave(e, instance)}}
            onClick={e=>{this.handleClick(e, instance)}}
         />
         {this.renderChildren(context, instance)}
      </g>
   }

   handleClick(e, instance) {
      if (!this.selection.isDummy) {
         this.selection.selectInstance(instance);
         e.stopPropagation();
         e.preventDefault();
      }
   }
}

PieSlice.prototype.offset = 0;
PieSlice.prototype.r0 = 0;
PieSlice.prototype.r = 50;
PieSlice.prototype.percentageRadius = true;
PieSlice.prototype.baseClass = 'pieslice';
PieSlice.prototype.legend = 'legend';
PieSlice.prototype.active = true;
PieSlice.prototype.pure = false;
PieSlice.prototype.stack = 'stack';
PieSlice.prototype.legendAction = 'auto';

Widget.alias('pie-chart', PieChart);