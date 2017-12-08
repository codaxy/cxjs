import {Axis} from './Axis';
import {VDOM} from '../../ui/Widget';
import {Stack} from './Stack';
import {Format} from '../../ui/Format';
import {isNumber} from '../../util/isNumber';

Format.registerFactory('yearOrMonth', (format) => {
   let year = Format.parse('datetime;yyyy');
   let month = Format.parse('datetime;MMM');
   return function (date) {
      let d = new Date(date);
      if (d.getMonth() == 0)
         return year(d);
      else
         return month(d);
   }
});

Format.registerFactory('monthOrDay', (format) => {
   let month = Format.parse('datetime;MMM');
   let day = Format.parse('datetime;dd');
   return function (date) {
      let d = new Date(date);
      if (d.getDate() == 1)
         return month(d);
      else
         return day(d);
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

   initInstance(context, instance) {
      instance.calculator = new TimeScale();
   }

   explore(context, instance) {
      super.explore(context, instance);
      let {min, max, normalized, inverted} = instance.data;
      instance.calculator.reset(min, max, this.snapToTicks, this.tickDivisions, this.minTickDistance, this.minLabelDistance, normalized, inverted, this.minTickUnit);
   }


   render(context, instance, key) {
      let {data, cached, calculator} = instance;

      cached.axis = calculator.hash();

      if (!data.bounds.valid())
         return null;

      let format = this.format || calculator.getFormat();
      let formatter = Format.parse(format);

      return <g key={key} className={data.classNames} style={data.style}>
         {this.renderTicksAndLabels(context, instance, formatter)}
      </g>
   }
}

Axis.alias('time', TimeAxis);

TimeAxis.prototype.baseClass = 'timeaxis';
TimeAxis.prototype.tickDivisions = {
   second: [[1, 5, 15, 30]],
   minute: [[1, 5, 15, 30]],
   hour: [
      [1, 2, 4, 8],
      [1, 3, 6, 12]
   ],
   day: [[1]],
   week: [[1]],
   month: [
      [1, 3, 6]
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
TimeAxis.prototype.minLabelDistance = 60;
TimeAxis.prototype.minTickDistance = 60;
TimeAxis.prototype.minTickUnit = 'second';

function monthNumber(date) {
   return date.getFullYear() * 12 + date.getMonth() + (date.getDate() - 1) / 31;
}

function yearNumber(date) {
   return monthNumber(date) / 12;
}

const miliSeconds = {
   second: 1000,
   minute: 60 * 1000,
   hour: 3600 * 1000,
   day: 3600 * 24 * 1000,
   week: 3600 * 24 * 7 * 1000,
   month: 3600 * 24 * 30 * 1000,
   year: 3600 * 24 * 365 * 1000
};

class TimeScale {
   reset(min, max, snapToTicks, tickDivisions, minTickDistance, minLabelDistance, normalized, inverted, minTickUnit) {
      this.dateCache = {};
      this.min = min != null ? this.decodeValue(min) : null;
      this.max = max != null ? this.decodeValue(max) : null;
      this.snapToTicks = snapToTicks;
      this.tickDivisions = tickDivisions;
      this.minLabelDistance = minLabelDistance;
      this.minTickDistance = minTickDistance;
      this.tickSizes = [];
      this.normalized = normalized;
      this.minTickUnit = minTickUnit;
      this.inverted = inverted;
      delete this.minValue;
      delete this.maxValue;
      delete this.minValuePad;
      delete this.maxValuePad;
      this.stacks = {};
   }

   decodeValue(date) {
      if (date instanceof Date)
         return date.getTime();

      switch (typeof date) {
         case 'string':
            let v = this.dateCache[date];
            if (!v)
               v = this.dateCache[date] = Date.parse(date);
            return v;

         case 'number':
            return date;
      }
   }

   encodeValue(v) {
      return new Date(v).toISOString();
   }

   getFormat() {
      switch (this.tickMeasure) {
         case 'year':
            return 'datetime;yyyy';

         case 'month':
            if (new Date(this.scale.min).getFullYear() != new Date(this.scale.max).getFullYear())
               return 'yearOrMonth';
            return 'datetime;yyyy MMM';

         case 'week':
            return 'datetime;MMMdd';

         case 'day':
            if (new Date(this.scale.min).getFullYear() != new Date(this.scale.max).getFullYear()
               || new Date(this.scale.min).getMonth() != new Date(this.scale.max).getMonth())
               return 'monthOrDay';

            return 'datetime;yyyy MMM dd';

         case 'hour':
            return 'datetime;HH mm n';

         case 'minute':
            return 'datetime;HH mm n';

         case 'second':
            return 'datetime;mm ss';

         default:
            return 'datetime;yyyy MMM dd HH mm ss n';
      }
   }

   map(v, offset = 0) {
      return this.origin + (this.decodeValue(v) + offset - this.scale.minPad) * this.scale.factor;
   }

   constrainValue(v) {
      return Math.max(this.scale.min, Math.min(this.scale.max, v));
   }

   trackValue(v, offset = 0, constrain = false) {
      let value = (this.decodeValue(v) - this.origin) / this.scale.factor - offset + this.scale.minPad;
      if (constrain)
         value = this.constrainValue(value);
      return value;
   }

   hash() {
      let r = {
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
      let hash = this.hash();
      let same = x && !Object.keys(hash).some(k=>x[k] !== hash[k]);
      this.shouldUpdate = !same;
      return same;
   }

   measure(a, b) {

      this.a = a;
      this.b = b;

      for (let s in this.stacks) {
         let info = this.stacks[s].measure(this.normalized);
         let [min, max, invalid] = info;
         if (this.minValue == null || min < this.minValue)
            this.minValue = min;
         if (this.max == null || max > this.maxValue)
            this.maxValue = max;
         this.stacks[s].info = info;
      }

      if (this.min == null) {
         if (this.minValue != null)
            this.min = this.minValue;
         else
            this.min = 0;
      }
      else
         this.minValuePad = this.min;

      if (this.max == null) {
         if (this.maxValue != null)
            this.max = this.maxValue;
         else
            this.max = this.normalized ? 1 : 100;
      }
      else
         this.maxValuePad = this.max;

      this.origin = this.inverted ? this.b : this.a;

      this.scale = this.getScale();

      this.calculateTicks();
   }

   getTimezoneOffset(date) {
      return date.getTimezoneOffset() * 60 * 1000;
   }

   getScale(tickSizes, measure) {
      let {min, max} = this;
      if (isNumber(this.snapToTicks) && measure && tickSizes && 0 <= this.snapToTicks && tickSizes.length > 0) {

         let size = tickSizes[Math.min(tickSizes.length - 1, this.snapToTicks)];

         let minDate = new Date(min);
         let maxDate = new Date(max);


         switch (measure) {
            case 'second':
            case 'minute':
            case 'hours':
            case 'day':
            default:
               let minOffset = this.getTimezoneOffset(minDate);
               let maxOffset = this.getTimezoneOffset(maxDate);
               min = Math.floor((min + minOffset) / size) * size - minOffset;
               max = Math.ceil((max + maxOffset) / size) * size - maxOffset;
               break;

            case 'month':
               size /= miliSeconds.month;
               let minMonth = monthNumber(minDate);
               let maxMonth = monthNumber(maxDate);
               minMonth = Math.floor(minMonth / size) * size;
               maxMonth = Math.ceil(maxMonth / size) * size;
               min = new Date(Math.floor(minMonth / 12), minMonth % 12, 1).getTime();
               max = new Date(Math.floor(maxMonth / 12), maxMonth % 12 + 1, 1).getTime();
               break;

            case 'year':
               size /= miliSeconds.year;
               let minYear = yearNumber(minDate);
               let maxYear = yearNumber(maxDate);
               minYear = Math.floor(minYear / size) * size;
               maxYear = Math.ceil(maxYear / size) * size;
               min = new Date(minYear, 0, 1).getTime();
               max = new Date(maxYear, 0, 1).getTime();
               break;
         }
      }

      let minPad = this.minValuePad != null ? Math.min(min, this.minValuePad) : min;
      let maxPad = this.maxValuePad != null ? Math.max(max, this.maxValuePad) : max;
      let factor = minPad < maxPad ? (this.b - this.a) / (maxPad - minPad) : 0;

      return {
         factor: this.inverted ? -factor : factor,
         min,
         max,
         minPad,
         maxPad
      }
   }

   acknowledge(value, width = 0, offset = 0) {
      value = this.decodeValue(value);
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
      let s = this.stacks[name];
      if (!s)
         s = this.stacks[name] = new Stack();
      return s;
   }

   stacknowledge(name, ordinal, value) {
      return this.getStack(name).acknowledge(ordinal, value);
   }

   stack(name, ordinal, value) {
      let v = this.getStack(name).stack(ordinal, value);
      return v != null ? this.map(v) : null;
   }

   findTickSize(minPxDist) {
      return this.tickSizes.find(a=>a * Math.abs(this.scale.factor) >= minPxDist);
   }

   getTickSizes() {
      return this.tickSizes;
   }

   calculateTicks() {

      let minReached = false;

      for (let unit in miliSeconds) {

         if (!minReached) {
            if (unit == this.minTickUnit)
               minReached = true;
            else
               continue;
         }

         let unitSize = miliSeconds[unit];
         let divisions = this.tickDivisions[unit];

         if (this.tickSizes.length > 0) {
            //add ticks from higher levels
            this.tickSizes.push(...divisions[0].map(s => s * unitSize));
            continue;
         }

         let bestLevel = 100;
         let bestTicks = [];
         let bestScale = this.scale;


         this.tickMeasure = unit;

         for (let i = 0; i < divisions.length && bestLevel > 0; i++) {
            let divs = divisions[i];
            let tickSizes = divs.map(s=>s * unitSize);
            let scale = this.getScale(tickSizes, unit);
            tickSizes.forEach((size, level)=> {
               let tickDistance = size * Math.abs(scale.factor);
               if (tickDistance >= this.minTickDistance && level < bestLevel) {
                  bestScale = scale;
                  bestTicks = tickSizes;
                  bestLevel = level;
               }
            });
         }
         this.scale = bestScale;
         this.tickSizes = bestTicks.filter(ts=>ts * Math.abs(bestScale.factor) >= this.minTickDistance);
      }
   }

   getTicks(tickSizes) {
      return tickSizes.map(size => {
         let result = [], start, end, minDate, maxDate;
         if (this.tickMeasure == 'year') {
            size /= miliSeconds.year;
            minDate = new Date(this.scale.min);
            maxDate = new Date(this.scale.max);
            start = Math.ceil(yearNumber(minDate) / size) * size;
            end = Math.floor(yearNumber(maxDate) / size) * size;
            for (let i = start; i <= end; i += size)
               result.push(new Date(i, 0, 1).getTime());
         }
         else if (this.tickMeasure == 'month') {
            size /= miliSeconds.month;
            minDate = new Date(this.scale.min);
            maxDate = new Date(this.scale.max);
            start = Math.ceil(monthNumber(minDate) / size) * size;
            end = Math.floor(monthNumber(maxDate) / size) * size;
            for (let i = start; i <= end; i += size)
               result.push(new Date(Math.floor(i / 12), i % 12, 1).getTime());
         }
         else {
            let minOffset = this.getTimezoneOffset(new Date(this.scale.min));
            let date = Math.ceil((this.scale.min - minOffset) / size) * size + minOffset;
            while (date <= this.scale.max) {
               result.push(date);
               date += size;
            }
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