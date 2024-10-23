import { Axis } from "./Axis";
import { VDOM } from "../../ui/Widget";
import { Stack } from "./Stack";
import { Format } from "../../ui/Format";
import { isNumber } from "../../util/isNumber";
import { zeroTime } from "../../util/date/zeroTime";
import { Console } from "../../util/Console";

Format.registerFactory("yearOrMonth", (format) => {
   let year = Format.parse("datetime;yyyy");
   let month = Format.parse("datetime;MMM");
   return function (date) {
      let d = new Date(date);
      if (d.getMonth() == 0) return year(d);
      else return month(d);
   };
});

Format.registerFactory("monthOrDay", (format) => {
   let month = Format.parse("datetime;MMM");
   let day = Format.parse("datetime;dd");
   return function (date) {
      let d = new Date(date);
      if (d.getDate() == 1) return month(d);
      else return day(d);
   };
});

export class TimeAxis extends Axis {
   init() {
      if (this.labelAnchor == "auto") this.labelAnchor = this.vertical ? (this.secondary ? "start" : "end") : "start";

      if (this.labelDx == "auto") this.labelDx = this.vertical ? 0 : "5px";

      if (this.deadZone) {
         this.lowerDeadZone = this.deadZone;
         pperDeadZone = this.deadZone;
      }

      this.minLabelDistanceFormatOverride = {
         ...this.minLabelDistanceFormatOverrideDefaults,
         ...this.minLabelDistanceFormatOverride,
      };

      super.init();
   }

   declareData() {
      super.declareData(...arguments, {
         anchors: undefined,
         min: undefined,
         max: undefined,
         inverted: undefined,
         lowerDeadZone: undefined,
         upperDeadZone: undefined,
      });
   }

   initInstance(context, instance) {
      instance.calculator = new TimeScale();
   }

   explore(context, instance) {
      super.explore(context, instance);
      let { min, max, normalized, inverted, lowerDeadZone, upperDeadZone } = instance.data;
      instance.calculator.reset(
         min,
         max,
         this.snapToTicks,
         this.tickDivisions,
         Math.max(1, this.minTickDistance),
         Math.max(1, this.minLabelDistance),
         normalized,
         inverted,
         this.minTickUnit,
         lowerDeadZone,
         upperDeadZone,
         this.decode,
         this.useLabelDistanceFormatOverrides ? this.minLabelDistanceFormatOverride : {},
         this.format,
      );
   }

   render(context, instance, key) {
      let { data, cached, calculator } = instance;

      cached.axis = calculator.hash();

      if (!data.bounds.valid()) return null;

      let format = calculator.resolvedFormat;
      let minLabelDistance = calculator.resolvedMinLabelDistance;
      let formatter = Format.parse(format);

      return (
         <g key={key} className={data.classNames} style={data.style}>
            {this.renderTicksAndLabels(context, instance, formatter, minLabelDistance)}
         </g>
      );
   }
}

Axis.alias("time", TimeAxis);

TimeAxis.prototype.baseClass = "timeaxis";
TimeAxis.prototype.tickDivisions = {
   second: [[1, 5, 15, 30]],
   minute: [[1, 5, 15, 30]],
   hour: [
      [1, 2, 4, 8],
      [1, 3, 6, 12],
   ],
   day: [[1]],
   week: [[1]],
   month: [[1, 3, 6]],
   year: [
      [1, 2, 10],
      [1, 5, 10],
      [5, 10, 50],
      [10, 50, 100],
   ],
};

const TimeFormats = {
   fullDateAndTime: "datetime;yyyy MMM dd HH mm ss n",
   shortMonthDate: "datetime;yyyy MMM dd",
};

TimeAxis.prototype.snapToTicks = 0;
TimeAxis.prototype.tickSize = 15;
TimeAxis.prototype.minLabelDistance = 60;
TimeAxis.prototype.minTickDistance = 60;
TimeAxis.prototype.minTickUnit = "second";
TimeAxis.prototype.useLabelDistanceFormatOverrides = false;
TimeAxis.prototype.minLabelDistanceFormatOverrideDefaults = {
   [TimeFormats.fullDateAndTime]: 150,
   [TimeFormats.shortMonthDate]: 90,
};

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
   year: 3600 * 24 * 365 * 1000,
};

class TimeScale {
   reset(
      min,
      max,
      snapToTicks,
      tickDivisions,
      minTickDistance,
      minLabelDistance,
      normalized,
      inverted,
      minTickUnit,
      lowerDeadZone,
      upperDeadZone,
      decode,
      minLabelDistanceFormatOverride,
      format,
   ) {
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
      this.lowerDeadZone = lowerDeadZone || 0;
      this.upperDeadZone = upperDeadZone || 0;
      delete this.minValue;
      delete this.maxValue;
      delete this.minValuePadded;
      delete this.maxValuePadded;
      this.stacks = {};
      this.decode = decode;
      this.minLabelDistanceFormatOverride = minLabelDistanceFormatOverride;
      this.format = format;
   }

   decodeValue(date) {
      if (date instanceof Date) return date.getTime();

      switch (typeof date) {
         case "string":
            let v = this.dateCache[date];
            if (!v) {
               if (this.decode) date = this.decode(date);
               v = this.dateCache[date] = Date.parse(date);
            }
            return v;

         case "number":
            return date;
      }
   }

   encodeValue(v) {
      return new Date(v).toISOString();
   }

   getFormat(unit, scale) {
      switch (unit) {
         case "year":
            return "datetime;yyyy";

         case "month":
            if (new Date(scale.min).getFullYear() != new Date(scale.max).getFullYear()) return "yearOrMonth";
            return "datetime;yyyy MMM";

         case "week":
            return "datetime;MMMdd";

         case "day":
            if (
               new Date(scale.min).getFullYear() != new Date(scale.max).getFullYear() ||
               new Date(scale.min).getMonth() != new Date(scale.max).getMonth()
            )
               return "monthOrDay";

            return TimeFormats.shortMonthDate;

         case "hour":
            return "datetime;HH mm n";

         case "minute":
            return "datetime;HH mm n";

         case "second":
            return "datetime;mm ss";

         default:
            return TimeFormats.fullDateAndTime;
      }
   }

   map(v, offset = 0) {
      return this.origin + (this.decodeValue(v) + offset - this.scale.min + this.scale.minPadding) * this.scale.factor;
   }

   constrainValue(v) {
      return Math.max(this.scale.min, Math.min(this.scale.max, v));
   }

   trackValue(v, offset = 0, constrain = false) {
      let value = (v - this.origin) / this.scale.factor - offset + this.scale.min - this.scale.minPadding;
      if (constrain) value = this.constrainValue(value);
      return value;
   }

   hash() {
      let r = {
         origin: this.origin,
         factor: this.scale.factor,
         min: this.scale.min,
         max: this.scale.max,
         minPadding: this.scale.minPadding,
         maxPadding: this.scale.maxPadding,
      };
      r.stacks = Object.keys(this.stacks)
         .map((s) => this.stacks[s].info.join(","))
         .join(":");
      return r;
   }

   isSame(x) {
      let hash = this.hash();
      let same = x && !Object.keys(hash).some((k) => x[k] !== hash[k]);
      this.shouldUpdate = !same;
      return same;
   }

   measure(a, b) {
      this.a = a;
      this.b = b;

      for (let s in this.stacks) {
         let info = this.stacks[s].measure(this.normalized);
         let [min, max, invalid] = info;
         if (this.minValue == null || min < this.minValue) this.minValue = min;
         if (this.max == null || max > this.maxValue) this.maxValue = max;
         this.stacks[s].info = info;
      }

      if (this.min == null) {
         if (this.minValue != null) this.min = this.minValue;
         else this.min = 0;
      }

      if (this.max == null) {
         if (this.maxValue != null) this.max = this.maxValue;
         else this.max = this.normalized ? 1 : 100;
      }

      this.origin = this.inverted ? this.b : this.a;

      this.calculateTicks();
      if (this.scale == null) {
         this.scale = this.getScale();
      }
   }

   getTimezoneOffset(date) {
      return date.getTimezoneOffset() * 60 * 1000;
   }

   getScale(tickSize, measure, minRange = 1000) {
      let { min, max, upperDeadZone, lowerDeadZone } = this;

      let smin = min;
      let smax = max;

      if (tickSize) {
         let minDate = new Date(min);
         let maxDate = new Date(max);

         switch (measure) {
            case "second":
            case "minute":
            case "hour":
            case "day":
            default:
               let minOffset = this.getTimezoneOffset(minDate);
               let maxOffset = this.getTimezoneOffset(maxDate);
               let mondayOffset = 4 * miliSeconds.day; //new Date(0).getDay() => 4
               smin = Math.floor((smin - minOffset - mondayOffset) / tickSize) * tickSize + minOffset + mondayOffset;
               smax = Math.ceil((smax - maxOffset - mondayOffset) / tickSize) * tickSize + maxOffset + mondayOffset;
               break;

            case "month":
               tickSize /= miliSeconds.month;
               let minMonth = monthNumber(minDate);
               let maxMonth = monthNumber(maxDate);
               minMonth = Math.floor(minMonth / tickSize) * tickSize;
               maxMonth = Math.ceil(maxMonth / tickSize) * tickSize;
               smin = new Date(Math.floor(minMonth / 12), minMonth % 12, 1).getTime();
               smax = new Date(Math.floor(maxMonth / 12), maxMonth % 12, 1).getTime();
               break;

            case "year":
               tickSize /= miliSeconds.year;
               let minYear = yearNumber(minDate);
               let maxYear = yearNumber(maxDate);
               minYear = Math.floor(minYear / tickSize) * tickSize;
               maxYear = Math.ceil(maxYear / tickSize) * tickSize;
               smin = new Date(minYear, 0, 1).getTime();
               smax = new Date(maxYear, 0, 1).getTime();
               break;
         }
      } else {
         if (this.minValue == min) smin = this.minValuePadded;
         if (this.maxValue == max) smax = this.maxValuePadded;
      }

      if (smax - smin < minRange) {
         let delta = (minRange - (smax - smin)) / 2;
         smin -= delta;
         smax += delta;
      }

      //padding should be activated only if using min/max obtained from the data
      let minPadding = this.minValue === min ? Math.max(0, smin - this.minValuePadded) : 0;
      let maxPadding = this.maxValue === max ? Math.max(0, this.maxValuePadded - smax) : 0;

      let factor = smin < smax ? Math.abs(this.b - this.a) / (smax - smin + minPadding + maxPadding) : 0;
      if (factor > 0 && (upperDeadZone > 0 || lowerDeadZone > 0)) {
         smin -= lowerDeadZone / factor;
         smax += upperDeadZone / factor;
         minPadding = this.minValuePadded != null ? Math.max(0, smin - this.minValuePadded) : 0;
         maxPadding = this.maxValuePadded != null ? Math.max(0, this.maxValuePadded - smax) : 0;
         factor = smin < smax ? Math.abs(this.b - this.a) / (smax - smin + minPadding + maxPadding) : 0;
      }

      let sign = this.b > this.a ? 1 : -1;

      return {
         factor: sign * (this.inverted ? -factor : factor),
         min: smin,
         max: smax,
         minPadding,
         maxPadding,
      };
   }

   acknowledge(value, width = 0, offset = 0) {
      value = this.decodeValue(value);
      if (this.minValue == null || value + offset - width / 2 < this.minValuePadded) {
         this.minValue = value;
         this.minValuePadded = value + offset - width / 2;
      }
      if (this.maxValue == null || value + offset + width / 2 > this.maxValuePadded) {
         this.maxValue = value;
         this.maxValuePadded = value + offset + width / 2;
      }
   }

   getStack(name) {
      let s = this.stacks[name];
      if (!s) s = this.stacks[name] = new Stack();
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
      return this.tickSizes.find(({ size, noLabels }) => !noLabels && size * Math.abs(this.scale.factor) >= minPxDist);
   }

   getTickSizes() {
      return this.tickSizes;
   }

   calculateTicks() {
      let minReached = false;

      let minRange = 1000;

      for (let unit in miliSeconds) {
         if (!minReached) {
            if (unit == this.minTickUnit) minReached = true;
            else continue;
         }

         let unitSize = miliSeconds[unit];
         let divisions = this.tickDivisions[unit];

         if (this.tickSizes.length > 0) {
            //add ticks from higher levels
            this.tickSizes.push(...divisions[0].map((s) => ({ size: s * unitSize, measure: unit })));
            break;
         }

         let bestLabelDistance = Infinity;
         let bestMinLabelDistance = this.minLabelDistance;
         let bestTicks = [];
         let bestScale = null;
         let bestFormat = null;

         this.tickMeasure = unit;

         for (let i = 0; i < divisions.length; i++) {
            let divs = divisions[i];
            for (let d = 0; d < divs.length; d++) {
               //if (useSnapToTicks && d < Math.min(divs.length - 1, this.snapToTicks)) continue;
               let tickSize = divs[d] * unitSize;
               let scale = this.getScale(null, unit, tickSize);
               let format = this.format ?? this.getFormat(unit, scale);
               let minLabelDistance = this.minLabelDistanceFormatOverride[format] ?? this.minLabelDistance;
               let labelDistance = tickSize * Math.abs(scale.factor);
               if (labelDistance >= minLabelDistance && labelDistance < bestLabelDistance) {
                  bestScale = scale;
                  bestTicks = divs.map((s) => s * unitSize);
                  bestLabelDistance = labelDistance;
                  bestFormat = format;
                  bestMinLabelDistance = minLabelDistance;
                  minRange = tickSize;
               }
            }
         }

         this.scale = bestScale;
         this.tickSizes = bestTicks
            .filter((ts) => ts * Math.abs(bestScale.factor) >= this.minTickDistance)
            .map((size) => ({ size, measure: this.tickMeasure }));
         this.resolvedFormat = bestFormat;
         this.resolvedMinLabelDistance = bestMinLabelDistance;
      }

      let lowerTickUnit = null;
      switch (this.tickMeasure) {
         case "year":
            lowerTickUnit = "month";
            break;
         case "month":
            lowerTickUnit = "day";
            break;
         case "week":
            lowerTickUnit = "day";
            break;
         case "day":
            lowerTickUnit = "hour";
            break;
         case "hour":
            lowerTickUnit = "minute";
            break;
         case "minute":
            lowerTickUnit = "second";
            break;
      }

      if (lowerTickUnit && this.minTickUnit && miliSeconds[lowerTickUnit] < miliSeconds[this.minTickUnit])
         lowerTickUnit = this.minTickUnit == this.tickMeasure ? null : this.minTickUnit;

      if (lowerTickUnit != null && this.scale) {
         let bestMinorTickSize = Infinity;
         let divisions = this.tickDivisions[lowerTickUnit];
         let unitSize = miliSeconds[lowerTickUnit];
         for (let i = 0; i < divisions.length; i++) {
            let divs = divisions[i];
            for (let d = 0; d < divs.length; d++) {
               let tickSize = divs[d] * unitSize;
               if (tickSize * Math.abs(this.scale.factor) >= this.minTickDistance && tickSize < bestMinorTickSize) {
                  bestMinorTickSize = tickSize;
               }
            }
         }
         if (bestMinorTickSize != Infinity) {
            this.tickSizes.unshift({ size: bestMinorTickSize, measure: lowerTickUnit, noLabels: true });
            if (this.tickSizes.length > 1) {
               let labelStep = this.tickSizes[1].size;
               let lowerScale = this.getScale(null, lowerTickUnit, minRange);
               if (lowerScale.max - lowerScale.min >= labelStep) this.scale = lowerScale;
            }
         }
      }

      if (isNumber(this.snapToTicks) && this.snapToTicks >= 0 && this.tickSizes.length > 0) {
         let tickSize = this.tickSizes[Math.min(this.tickSizes.length - 1, this.snapToTicks)];
         this.scale = this.getScale(tickSize.size, tickSize.measure, minRange);
      }
   }

   getTicks(tickSizes) {
      return tickSizes.map(({ size, measure }) => {
         let result = [],
            start,
            end,
            minDate,
            maxDate;
         if (measure == "year") {
            size /= miliSeconds.year;
            minDate = new Date(this.scale.min - this.scale.minPadding);
            maxDate = new Date(this.scale.max + this.scale.maxPadding);
            start = Math.ceil(yearNumber(minDate) / size) * size;
            end = Math.floor(yearNumber(maxDate) / size) * size;
            for (let i = start; i <= end; i += size) result.push(new Date(i, 0, 1).getTime());
         } else if (measure == "month") {
            size /= miliSeconds.month;
            minDate = new Date(this.scale.min - this.scale.minPadding);
            maxDate = new Date(this.scale.max + this.scale.maxPadding);
            start = Math.ceil(monthNumber(minDate) / size) * size;
            end = Math.floor(monthNumber(maxDate) / size) * size;
            for (let i = start; i <= end; i += size) result.push(new Date(Math.floor(i / 12), i % 12, 1).getTime());
         } else if (measure == "day" || measure == "week") {
            let multiplier = measure == "week" ? 7 : 1;
            size /= miliSeconds.day;
            minDate = new Date(this.scale.min - this.scale.minPadding);
            maxDate = new Date(this.scale.max + this.scale.maxPadding);
            let date = zeroTime(minDate);
            while (date.getTime() < minDate.getTime()) date.setDate(date.getDate() + 1);
            if (measure == "week") {
               //start on monday
               while (date.getDay() != 1) {
                  date.setDate(date.getDate() + 1);
               }
            }
            while (date.getTime() <= maxDate.getTime()) {
               result.push(date);
               date = new Date(date);
               date.setDate(date.getDate() + multiplier);
            }
         } else {
            let minOffset = this.getTimezoneOffset(new Date(this.scale.min - this.scale.minPadding));
            let mondayOffset = 4 * miliSeconds.day;
            let date =
               Math.ceil((this.scale.min - this.scale.minPadding - minOffset - mondayOffset) / size) * size +
               minOffset +
               mondayOffset;
            while (date <= this.scale.max + this.scale.maxPadding) {
               result.push(date);
               date += size;
            }
         }
         return result;
      });
   }

   mapGridlines() {
      if (this.tickSizes.length == 0) return [];
      return this.getTicks([this.tickSizes[0]])[0].map((x) => this.map(x));
   }

   book() {
      Console.warn("TimeAxis does not support the autoSize flag for column and bar graphs.");
   }
}
