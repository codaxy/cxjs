import { Stack } from "./Stack";
import { isNumber } from "../../util/isNumber";
import { Console } from "../../util/Console";

export class NumericScale {
   min: number;
   max: number;
   snapToTicks: number;
   tickDivisions: number[][];
   minLabelDistance: number;
   minLabelTickSize: number;
   minTickDistance: number;
   minTickStep: number;
   tickSizes: number[];
   normalized: boolean;
   inverted: boolean;
   minValue?: number;
   maxValue?: number;
   minValuePadded: number;
   maxValuePadded: number;
   stacks: Record<string, Stack>;
   lowerDeadZone: number;
   upperDeadZone: number;
   origin: number;
   scale: { factor: number; min: number; max: number; minPadding: number; maxPadding: number };
   a: number;
   b: number;
   shouldUpdate: boolean;

   reset(
      min: number,
      max: number,
      snapToTicks: number,
      tickDivisions: number[][],
      minTickDistance: number,
      minTickStep: number,
      minLabelDistance: number,
      minLabelTickSize: number,
      normalized: boolean,
      inverted: boolean,
      lowerDeadZone: number,
      upperDeadZone: number,
   ): void {
      this.min = min;
      this.max = max;
      this.snapToTicks = snapToTicks;
      this.tickDivisions = tickDivisions;
      this.minLabelDistance = minLabelDistance;
      this.minLabelTickSize = minLabelTickSize;
      this.minTickDistance = minTickDistance;
      this.minTickStep = minTickStep;
      this.tickSizes = [];
      this.normalized = normalized;
      this.inverted = inverted;
      delete this.minValue;
      delete this.maxValue;
      this.stacks = {};
      this.lowerDeadZone = lowerDeadZone || 0;
      this.upperDeadZone = upperDeadZone || 0;
   }

   map(v: number, offset: number = 0): number {
      return this.origin + (v + offset - this.scale.min + this.scale.minPadding) * this.scale.factor;
   }

   decodeValue(n: number): number {
      return n;
   }

   encodeValue(v: number): number {
      return v;
   }

   constrainValue(v: number): number {
      return Math.max(this.scale.min, Math.min(this.scale.max, v));
   }

   trackValue(v: number, offset: number = 0, constrain: boolean = false): number {
      let value = (v - this.origin) / this.scale.factor - offset + this.scale.min - this.scale.minPadding;
      if (constrain) value = this.constrainValue(value);
      return value;
   }

   hash(): any {
      let r: any = {
         origin: this.origin,
         factor: this.scale.factor,
         min: this.scale.min,
         max: this.scale.max,
         minPadding: this.scale.minPadding,
         maxPadding: this.scale.maxPadding,
      };
      r.stacks = Object.keys(this.stacks)
         .map((s) => this.stacks[s].info?.join(","))
         .join(":");
      return r;
   }

   isSame(x: any): boolean {
      let hash = this.hash();
      let same = x && !Object.keys(hash).some((k) => x[k] !== hash[k]);
      this.shouldUpdate = !same;
      return same;
   }

   measure(a: number, b: number): void {
      this.a = a;
      this.b = b;

      if (this.minValue != null && this.min == null) this.min = this.minValue;
      if (this.maxValue != null && this.max == null) this.max = this.maxValue;

      for (let s in this.stacks) {
         let info = this.stacks[s].measure(this.normalized);
         let [min, max] = info;
         if (this.min == null || min < this.min) this.min = min;
         if (this.max == null || max > this.max) this.max = max;
         this.stacks[s].info = info;
      }

      if (this.min == null) this.min = 0;
      if (this.max == null) this.max = this.normalized ? 1 : 100;

      if (this.min == this.max) {
         if (this.min == 0) {
            this.min = -1;
            this.max = 1;
         } else {
            let delta = Math.abs(this.min) * 0.1;
            this.min -= delta;
            this.max += delta;
         }
      }

      this.origin = this.inverted ? this.b : this.a;

      this.scale = this.getScale();

      this.calculateTicks();
   }

   getScale(tickSizes?: number[]): { factor: number; min: number; max: number; minPadding: number; maxPadding: number } {
      let { min, max } = this;
      let smin = min;
      let smax = max;

      let tickSize;
      if (tickSizes && isNumber(this.snapToTicks) && tickSizes.length > 0) {
         tickSize = tickSizes[Math.min(tickSizes.length - 1, this.snapToTicks)];
         smin = Math.floor(smin / tickSize) * tickSize;
         smax = Math.ceil(smax / tickSize) * tickSize;
      } else {
         if (this.minValue === min) smin = this.minValuePadded;
         if (this.maxValue === max) smax = this.maxValuePadded;
      }

      let minPadding = this.minValue === min ? Math.max(0, smin - this.minValuePadded) : 0;
      let maxPadding = this.maxValue === max ? Math.max(0, this.maxValuePadded - smax) : 0;

      let sign = this.b > this.a ? 1 : -1;

      let factor =
         smin < smax
            ? (Math.abs(this.b - this.a) - this.lowerDeadZone - this.upperDeadZone) /
              (smax - smin + minPadding + maxPadding)
            : 0;

      if (factor < 0) factor = 0;

      if (factor > 0 && (this.lowerDeadZone > 0 || this.upperDeadZone > 0)) {
         while (factor * (min - smin) < this.lowerDeadZone) smin -= this.lowerDeadZone / factor;

         while (factor * (smax - max) < this.upperDeadZone) smax += this.upperDeadZone / factor;

         if (tickSize! > 0 && isNumber(this.snapToTicks)) {
            smin = Math.floor(smin / tickSize!) * tickSize!;
            smax = Math.ceil(smax / tickSize!) * tickSize!;
            minPadding = this.minValue === min ? Math.max(0, smin - this.minValuePadded) : 0;
            maxPadding = this.maxValue === max ? Math.max(0, this.maxValuePadded - smax) : 0;
         }

         factor = smin < smax ? Math.abs(this.b - this.a) / (smax - smin + minPadding + maxPadding) : 0;
      }

      return {
         factor: sign * (this.inverted ? -factor : factor),
         min: smin,
         max: smax,
         minPadding,
         maxPadding,
      };
   }

   acknowledge(value: number, width: number = 0, offset: number = 0): void {
      if (value == null) return;

      if (this.minValue == null || value < this.minValue) {
         this.minValue = value;
         this.minValuePadded = value + offset - width / 2;
      }
      if (this.maxValue == null || value > this.maxValue) {
         this.maxValue = value;
         this.maxValuePadded = value + offset + width / 2;
      }
   }

   getStack(name: string): Stack {
      let s = this.stacks[name];
      if (!s) s = this.stacks[name] = new Stack();
      return s;
   }

   stacknowledge(name: string, ordinal: any, value: any): any {
      return this.getStack(name).acknowledge(ordinal, value);
   }

   stack(name: string, ordinal: any, value: any): number | null {
      let v = this.getStack(name).stack(ordinal, value);
      return v != null ? this.map(v) : null;
   }

   findTickSize(minPxDist: number): number | undefined {
      return this.tickSizes.find((a) => a >= this.minLabelTickSize && a * Math.abs(this.scale.factor) >= minPxDist);
   }

   getTickSizes(): number[] {
      return this.tickSizes;
   }

   calculateTicks(): void {
      let dist = this.minLabelDistance / Math.abs(this.scale.factor);
      let unit = Math.pow(10, Math.floor(Math.log10(dist)));

      let bestLabelDistance = Infinity;
      let bestTicks: number[] = [];
      let bestScale = this.scale;

      for (let i = 0; i < this.tickDivisions.length; i++) {
         let divs = this.tickDivisions[i];
         let tickSizes = divs.filter((ts) => ts >= this.minTickStep).map((ts) => ts * unit);
         let scale = this.getScale(tickSizes);
         tickSizes.forEach((size, level) => {
            let labelDistance = size * Math.abs(scale.factor);
            if (labelDistance >= this.minLabelDistance && labelDistance < bestLabelDistance) {
               bestScale = scale;
               bestTicks = tickSizes;
               bestLabelDistance = labelDistance;
            }
         });
      }
      this.scale = bestScale;
      this.tickSizes = bestTicks.filter(
         (ts) => ts >= this.minTickStep && ts * Math.abs(bestScale.factor) >= this.minTickDistance,
      );
      if (this.tickSizes.length > 0) {
         let max = this.tickSizes[this.tickSizes.length - 1];
         this.tickSizes.push(2 * max);
         this.tickSizes.push(5 * max);
         this.tickSizes.push(10 * max);
         let min = this.tickSizes[0];
         let minDist = min * Math.abs(bestScale.factor);
         if (min / 10 >= this.minTickStep && minDist / 10 >= this.minTickDistance) this.tickSizes.splice(0, 0, min / 10);
         else if (min / 5 >= this.minTickStep && minDist / 5 >= this.minTickDistance) this.tickSizes.splice(0, 0, min / 5);
         else if (min / 2 >= this.minTickStep && minDist / 2 >= this.minTickDistance) this.tickSizes.splice(0, 0, min / 2);
      }
   }

   getTicks(tickSizes: number[]): number[][] {
      return tickSizes.map((size) => {
         let start = Math.ceil((this.scale.min - this.scale.minPadding) / size);
         let end = Math.floor((this.scale.max + this.scale.maxPadding) / size);
         let result: number[] = [];
         for (let i = start; i <= end; i++) result.push(i * size + 0);
         return result;
      });
   }

   mapGridlines(): number[] {
      let size = this.tickSizes[0];
      let start = Math.ceil((this.scale.min - this.scale.minPadding) / size);
      let end = Math.floor((this.scale.max + this.scale.maxPadding) / size);
      let result: number[] = [];
      for (let i = start; i <= end; i++) result.push(this.map(i * size));
      return result;
   }

   book(): void {
      Console.warn("NumericAxis does not support the autoSize flag for column and bar graphs.");
   }
}
