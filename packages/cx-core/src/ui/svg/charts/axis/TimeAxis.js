import {Axis} from './Axis';
import {VDOM} from '../../../Widget';
import {Stack} from './Stack';
import {Format} from '../../../../util/Format';

Format.registerFactory('yearOrMonth', (format) => {
   var year = Format.parse('datetime;yyyy');
   var month = Format.parse('datetime;MMM');
   return function (date) {
      var d = new Date(date);
      if (d.getMonth() == 0)
         return year(d);
      else
         return month(d);
   }
});

export class TimeAxis extends Axis {

   init() {
      if (this.labelAnchor == 'auto')
         this.labelAnchor = this.vertical ? this.secondary ? 'start' : 'end' : 'start';

      if (this.labelDx == 'auto')
         this.labelDx = this.vertical ? 0 : '5px';

      super.init();
   }


   declareData() {
      super.declareData(...arguments, {
         anchors: undefined,
         min: undefined,
         max: undefined,
         inverted: undefined
      })
   }

   render(context, instance, key) {
      var {data, cached, calculator} = instance;

      cached.axis = calculator.hash();

      if (!data.bounds.valid())
         return null;

      var format = this.format || calculator.getFormat();
      var formatter = Format.parse(format);

      return <g key={key} className={data.classNames} style={data.style}>
         {this.renderTicksAndLabels(context, instance, formatter)}
      </g>
   }

   explore(context, instance) {
      super.explore(context, instance);
      var {min, max, normalized, inverted} = instance.data;
      if (!instance.calculator)
         instance.calculator = new TimeScale();
      instance.calculator.reset(min, max, this.snapToTicks, this.tickDivisions, this.minTickDistance, this.minLabelDistance, normalized, inverted);
   }
}

Axis.alias('time', TimeAxis);

TimeAxis.prototype.baseClass = 'timeaxis';
TimeAxis.prototype.tickDivisions = {
   second: [[1, 5, 15, 30]],
   minute: [[1, 5, 15, 30]],
   hour: [
      [1, 2, 4, 8, 24],
      [1, 3, 6, 12, 24]
   ],
   day: [[1, 7, 14]],
   month: [
      [1, 3, 6, 12, 60, 120]
   ],
   year: [
      [1, 2, 10],
      [1, 5, 10],
      [5, 10, 50],
      [10, 50, 100]
   ]
};

TimeAxis.prototype.snapToTicks = 0;
TimeAxis.prototype.tickSize = 15;
TimeAxis.prototype.minLabelDistance = 50;
TimeAxis.prototype.minTickDistance = 50;

// const miliSeconds = {
//    year: 3600 * 24 * 365 * 1000,
//    month: 3600 * 24 * 30 * 1000,
//    day: 3600 * 24 * 1000,
//    hour: 3600 * 1000,
//    minute: 60 * 1000
// };

const miliSeconds = {
   minute: 60 * 1000,
   hour: 3600 * 1000,
   day: 3600 * 24 * 1000,
   month: 3600 * 24 * 30 * 1000,
   year: 3600 * 24 * 365 * 1000
};

class TimeScale {
   reset(min, max, snapToTicks, tickDivisions, minTickDistance, minLabelDistance, normalized, inverted) {
      this.dateCache = {};
      this.min = min != null ? this.getValue(min) : null;
      this.max = max != null ? this.getValue(max) : null;
      this.snapToTicks = snapToTicks;
      this.tickDivisions = tickDivisions;
      this.minLabelDistance = minLabelDistance;
      this.minTickDistance = minTickDistance;
      this.tickSizes = [];
      this.normalized = normalized;
      this.inverted = inverted;
      delete this.minValue;
      delete this.maxValue;
      delete this.minValuePad;
      delete this.maxValuePad;
      this.stacks = {};
   }

   getValue(date) {
      if (date instanceof Date)
         return date.getTime();

      switch (typeof date) {
         case 'string':
            var v = this.dateCache[date];
            if (!v)
               v = this.dateCache[date] = Date.parse(date);
            return v;

         case 'number':
            return date;
      }
   }

   getFormat() {
      switch (this.tickMeasure) {
         case 'year':
            return 'datetime;yyyy';

         case 'month':
            if (new Date(this.scale.min).getFullYear() != new Date(this.scale.max).getFullYear())
               return 'yearOrMonth';
            return 'datetime;yyyy MMM';

         case 'day':
            return 'datetime;yyyy MMM dd';
      }
   }

   map(v, offset = 0) {
      return this.origin + (this.getValue(v) + offset - this.scale.minPad) * this.scale.factor;
   }

   track(v, offset = 0) {
      return (this.getValue(v) - this.origin) / this.scale.factor - offset + this.scale.minPad;
   }

   hash() {
      var r = {
         origin: this.origin,
         factor: this.scale.factor,
         min: this.scale.min,
         max: this.scale.max,
         minPad: this.scale.minPad,
         maxPad: this.scale.maxPad,
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

   getScale(tickSizes, measure) {
      var {min, max} = this;
      if (measure && tickSizes && 0 <= this.snapToTicks && tickSizes.length > 0) {

         var size = tickSizes[Math.min(tickSizes.length - 1, this.snapToTicks)];

         switch (measure) {
            case 'second':
            case 'minute':
            case 'hours':
            case 'day':
            default:
               min = Math.floor(min / size) * size;
               max = Math.ceil(max / size) * size;
               break;

            case 'month':
               size /= miliSeconds.month;
               var minDate = new Date(min);
               var maxDate = new Date(max);
               var minMonth = minDate.getFullYear() * 12 + minDate.getMonth();
               var maxMonth = maxDate.getFullYear() * 12 + maxDate.getMonth();
               minMonth = Math.floor(minMonth / size) * size;
               maxMonth = Math.ceil(maxMonth / size) * size;
               min = new Date(Math.floor(minMonth / 12), minMonth % 12, 1).getTime();
               max = new Date(Math.floor(maxMonth / 12), maxMonth % 12, 1).getTime();
               break;

            case 'year':
               size /= miliSeconds.year;
               var minYear = new Date(min).getFullYear();
               var maxYear = new Date(max).getFullYear();
               minYear = Math.floor(minYear / size) * size;
               maxYear = Math.ceil(maxYear / size) * size;
               min = new Date(minYear, 0, 1).getTime();
               max = new Date(maxYear, 0, 1).getTime();
               break;
         }
      }

      var minPad = this.minValuePad != null ? Math.min(min, this.minValuePad) : min;
      var maxPad = this.maxValuePad != null ? Math.max(max, this.maxValuePad) : max;
      var factor = minPad < maxPad ? (this.b - this.a) / (maxPad - minPad) : 0;
      return {
         factor: this.inverted ? -factor : factor,
         min,
         max,
         minPad,
         maxPad
      }
   }

   acknowledge(value, width = 0, offset = 0) {
      value = this.getValue(value);
      if (this.minValue == null || value < this.minValue) {
         this.minValue = value;
         this.minValuePad = value + offset - width / 2;
      }
      if (this.maxValue == null || value > this.maxValue) {
         this.maxValue = value;
         this.maxValuePad = value + offset + width / 2;
      }
   }

   getStack(name) {
      var s = this.stacks[name];
      if (!s)
         s = this.stacks[name] = new Stack();
      return s;
   }

   stacknowledge(name, ordinal, value) {
      return this.getStack(name).acknowledge(ordinal, this.getValue(value));
   }

   stack(name, ordinal, value) {
      var v = this.getStack(name).stack(ordinal, this.getValue(value));
      return v != null ? this.map(v) : null;
   }

   findTickSize(minPxDist) {
      return this.tickSizes.find(a=>a * Math.abs(this.scale.factor) >= minPxDist);
   }

   getTickSizes() {
      return this.tickSizes;
   }

   calculateTicks() {
      // var dist = this.minLabelDistance / Math.abs(this.scale.factor); //dist in seconds
      //
      // var measure = 'second';
      // var unitSize = 1;
      //
      // for (var key in miliSeconds)
      //    if (dist > miliSeconds[key] || key == 'month') {
      //       measure = key;
      //       unitSize = miliSeconds[key];
      //       break;
      //    }
      //
      // this.tickMeasure = measure;


      for (var measure in miliSeconds) {
         var bestLevel = 100;
         var bestTicks = [];
         var bestScale = this.scale;

         var unitSize = miliSeconds[measure];
         this.tickMeasure = measure;

         for (var i = 0; i < this.tickDivisions[measure].length && bestLevel > 0; i++) {
            var divs = this.tickDivisions[measure][i];
            var tickSizes = divs.map(s=>s * unitSize);
            var scale = this.getScale(tickSizes, measure);
            tickSizes.forEach((size, level)=> {
               var tickDistance = size * Math.abs(scale.factor);
               if (tickDistance >= this.minTickDistance && level < bestLevel) {
                  bestScale = scale;
                  bestTicks = tickSizes;
                  bestLevel = level;
               }
            });
         }
         this.scale = bestScale;
         this.tickSizes = bestTicks.filter(ts=>ts * Math.abs(bestScale.factor) >= this.minTickDistance);
         if (this.tickSizes.length > 0)
            break;
      }
   }

   getTicks(tickSizes) {
      return tickSizes.map(size => {
         var result = [], start, end, minDate, maxDate;
         if (this.tickMeasure == 'year') {
            size /= miliSeconds.year;
            start = Math.ceil(new Date(this.scale.min).getFullYear() / size) * size;
            end = Math.floor(new Date(this.scale.max).getFullYear() / size) * size;
            for (var i = start; i <= end; i += size)
               result.push(new Date(i, 0, 1).getTime());
         }
         else if (this.tickMeasure == 'month') {
            size /= miliSeconds.month;
            minDate = new Date(this.scale.min);
            maxDate = new Date(this.scale.max);
            start = Math.ceil((minDate.getFullYear() * 12 + minDate.getMonth()) / size) * size;
            end = Math.floor((maxDate.getFullYear() * 12 + maxDate.getMonth()) / size) * size;
            for (var i = start; i <= end; i += size)
               result.push(new Date(Math.floor(i / 12), i % 12, 1).getTime());
         }
         else {
            start = Math.ceil(this.scale.min / size);
            end = Math.floor(this.scale.max / size);
            for (var i = start; i <= end; i++)
               result.push(i * size);
         }
         return result;
      })
   }

   mapGridlines() {
      if (this.tickSizes.length == 0)
         return [];

      return this.getTicks([this.tickSizes[0]])[0].map(x=>this.map(x));
   }
}