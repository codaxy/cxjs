export class Stack {
   constructor() {
      this.reset();
   }

   reset() {
      this.stacks = {};
      this.values = {};
      this.normalized = false;
      this.invalid = {};
   }

   acknowledge(ordinal, value) {
      if (value != null) {
         let s = this.stacks[ordinal];
         if (!s) this.stacks[ordinal] = s = { total: 0, min: 0, max: 0 };
         s.total += value;
         if (s.total < s.min) s.min = s.total;
         if (s.total > s.max) s.max = s.total;
      } else {
         this.invalid[ordinal] = true;
      }
   }

   measure(normalized) {
      if (normalized) {
         this.normalized = true;
         return [0, 1];
      }

      let max = 0,
         min = 0;
      for (let key in this.stacks) {
         if (this.stacks[key].max > max) max = this.stacks[key].max;
         if (this.stacks[key].min < min) min = this.stacks[key].min;
      }
      return [min, max];
   }

   stack(ordinal, value) {
      if (value == null || this.invalid[ordinal]) return null;

      let base = this.values[ordinal] || 0;

      let result = (this.values[ordinal] = base + value);

      if (!this.normalized) return result;

      let total = this.stacks[ordinal].total;

      if (total > 0) return result / total;

      return null;
   }
}
