import {Axis} from './Axis';
import {VDOM} from '../../ui/Widget';
import {Stack} from './Stack';
import {Format} from '../../util/Format';

export class NumericAxis extends Axis {

   declareData() {
      super.declareData(...arguments, {
         min: undefined,
         max: undefined,
         normalized: undefined,
         inverted: undefined,
         labelDivisor: undefined,
         format: undefined
      })
   }

   render(context, instance, key) {
      var {data} = instance;

      if (!data.bounds.valid())
         return null;

      var baseFormatter = Format.parse(data.format);
      var formatter = data.labelDivisor != 1
         ?  v => baseFormatter(v / data.labelDivisor)
         : baseFormatter;

      return <g key={key} className={data.classNames} style={data.style}>
         {this.renderTicksAndLabels(context, instance, formatter)}
      </g>
   }

   explore(context, instance) {
      super.explore(context, instance);
      var {min, max, normalized, inverted} = instance.data;
      if (!instance.calculator)
         instance.calculator = new NumericScale();
      instance.calculator.reset(min, max, this.snapToTicks, this.tickDivisions, this.minTickDistance, this.minLabelDistance, normalized, inverted);
   }

   static XY() {
      return {
         x: {type: NumericAxis},
         y: {type: NumericAxis, vertical: true}
      }
   }
}

NumericAxis.prototype.baseClass = 'numericaxis';
NumericAxis.prototype.tickDivisions = [
   [1, 2, 10],
   [1, 5, 10],
   [2.5, 5, 10],
   //[2, 4, 10],
   [5, 10]
];

NumericAxis.prototype.snapToTicks = 1;
NumericAxis.prototype.normalized = false;
NumericAxis.prototype.format = 'n';
NumericAxis.prototype.labelDivisor = 1;

Axis.alias('numeric', NumericAxis);

class NumericScale {

   reset(min, max, snapToTicks, tickDivisions, minTickDistance, minLabelDistance, normalized, inverted) {
      this.padding = 0;
      this.min = min;
      this.max = max;
      this.snapToTicks = snapToTicks;
      this.tickDivisions = tickDivisions;
      this.minLabelDistance = minLabelDistance;
      this.minTickDistance = minTickDistance;
      this.tickSizes = [];
      this.normalized = normalized;
      this.inverted = inverted;
      delete this.minValue;
      delete this.maxValue;
      this.stacks = {};
   }

   map(v, offset = 0) {
      return this.origin + (v + offset - this.scale.min + this.padding) * this.scale.factor;
   }

   decodeValue(n) {
      return n;
   }

   encodeValue(v) {
      return v;
   }

   constrainValue(v) {
      return Math.max(this.scale.min, Math.min(this.scale.max, v));
   }

   trackValue(v, offset = 0, constrain = false) {
      var value = (v - this.origin) / this.scale.factor - offset + this.scale.min - this.padding;
      if (constrain)
         value = this.constrainValue(v);
      return value;
   }

   hash() {
      var r = {
         origin: this.origin,
         factor: this.scale.factor,
         min: this.scale.min,
         max: this.scale.max,
         padding: this.padding
      };
      r.stacks = Object.keys(this.stacks).map(s=>this.stacks[s].info.join(',')).join(':');
      return r;
   }

   isSame(x) {
      var hash = this.hash();
      var same = x && !Object.keys(hash).some(k=>x[k] !== hash[k]);
      this.shouldUpdate = !same;
      return same;
   }

   measure(a, b) {

      this.a = a;
      this.b = b;

      for (var s in this.stacks) {
         var info = this.stacks[s].measure(this.normalized);
         var [min, max, invalid] = info;
         if (this.min == null || min < this.min)
            this.min = min;
         if (this.max == null || max > this.max)
            this.max = max;
         this.stacks[s].info = info;
      }

      if (this.minValue != null && (this.min == null || this.minValue < this.min))
         this.min = this.minValue;

      if (this.min == null)
         this.min = 0;

      if (this.maxValue != null && (this.max == null || this.maxValue > this.max))
         this.max = this.maxValue;

      if (this.max == null)
         this.max = this.normalized ? 1 : 100;

      this.origin = this.inverted ? this.b : this.a;

      this.scale = this.getScale();

      this.calculateTicks();
   }

   getScale(tickSizes) {
      var {min, max} = this;
      if (tickSizes && 0 <= this.snapToTicks && tickSizes.length > 0) {
         var size = tickSizes[Math.min(tickSizes.length - 1, this.snapToTicks)];
         min = Math.floor(min / size) * size;
         max = Math.ceil(max / size) * size;
      }

      var factor = min < max ? (this.b - this.a) / (max - min + 2 * this.padding) : 0;
      return {
         factor: this.inverted ? -factor : factor,
         min: min,
         max: max
      }
   }

   acknowledge(value, width = 0, offset = 0) {
      if (this.minValue == null || value < this.minValue) {
         this.minValue = value;
         this.padding = Math.max(this.padding, Math.abs(offset - width / 2));
      }
      if (this.maxValue == null || value > this.maxValue) {
         this.maxValue = value;
         this.padding = Math.max(this.padding, Math.abs(offset + width / 2));
      }
   }

   getStack(name) {
      var s = this.stacks[name];
      if (!s)
         s = this.stacks[name] = new Stack();
      return s;
   }

   stacknowledge(name, ordinal, value) {
      return this.getStack(name).acknowledge(ordinal, value);
   }

   stack(name, ordinal, value) {
      var v = this.getStack(name).stack(ordinal, value);
      return v != null ? this.map(v) : null;
   }

   findTickSize(minPxDist) {
      return this.tickSizes.find(a=>a * Math.abs(this.scale.factor) >= minPxDist);
   }

   getTickSizes() {
      return this.tickSizes;
   }

   calculateTicks() {
      var dist = this.minLabelDistance / Math.abs(this.scale.factor);
      var unit = Math.pow(10, Math.floor(Math.log10(dist)));

      var bestLevel = 100;
      var bestTicks = [];
      var bestScale = this.scale;

      for (var i = 0; i < this.tickDivisions.length && bestLevel > 0; i++) {
         var divs = this.tickDivisions[i];
         var tickSizes = divs.map(s => s * unit);
         var scale = this.getScale(tickSizes);
         tickSizes.forEach((size, level)=> {
            if (size * Math.abs(scale.factor) >= this.minTickDistance && level < bestLevel) {
               bestScale = scale;
               bestTicks = tickSizes;
               bestLevel = level;
            }
         });
      }
      this.scale = bestScale;
      this.tickSizes = bestTicks.filter(ts=>ts * Math.abs(bestScale.factor) >= this.minTickDistance);
   }

   getTicks(tickSizes) {
      return tickSizes.map(size => {
         var start = Math.ceil(this.scale.min / size);
         var end = Math.floor(this.scale.max / size);
         var result = [];
         for (var i = start; i <= end; i++)
            result.push(i * size);
         return result;
      })
   }

   mapGridlines() {
      var size = this.tickSizes[0];
      var start = Math.ceil(this.scale.min / size);
      var end = Math.floor(this.scale.max / size);
      var result = [];
      for (var i = start; i <= end; i++)
         result.push(this.map(i * size));
      return result;
   }
}