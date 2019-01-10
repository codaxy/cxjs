export class AggregateFunction {
   static sum() {
      return new Sum();
   }

   static avg() {
      return new Avg();
   }

   static count() {
      return new Count();
   }

   static distinct() {
      return new Distinct();
   }

   static min() {
      return new Min();
   }

   static max() {
      return new Max();
   }
}

class Sum {
   process(value) {
      this.empty = false;
      if (!isNaN(value))
         this.result += value;
      else
         this.invalid = true;
   }

   getResult() {
      if (this.invalid)
         return null;
      return this.result;
   }
}

Sum.prototype.result = 0;
Sum.prototype.empty = true;

class Avg {
   process(value, count = 1) {
      this.empty = false;
      if (!isNaN(value) && !isNaN(count)) {
         this.result += value * count;
         this.count += count;
      }
      else
         this.invalid = true;
   }

   getResult() {
      if (this.empty || this.invalid || this.count == 0)
         return null;
      return this.result / this.count;
   }
}

Avg.prototype.result = 0;
Avg.prototype.count = 0;
Avg.prototype.empty = true;

class Count {
   process(value) {
      if (value != null)
         this.result++;
   }

   getResult() {
      return this.result;
   }
}

Count.prototype.result = 0;


class Distinct {
   constructor() {
      this.values = {};
   }

   process(value) {
      if (value == null || this.values[value])
         return;
      this.values[value] = true;
      this.empty = false;
      this.result++;
   }

   getResult() {
      if (this.empty || this.invalid)
         return null;
      return this.result;
   }
}

Distinct.prototype.result = 0;
Distinct.prototype.empty = true;

class Max {
   process(value) {
      if (!isNaN(value)) {
         if (this.empty)
            this.result = value;
         else if (value > this.result)
            this.result = value;
         this.empty = false;
      }
      else if (value != null)
         this.invalid = true;
   }

   getResult() {
      if (this.empty || this.invalid)
         return null;
      return this.result;
   }
}

Max.prototype.result = 0;
Max.prototype.empty = true;

class Min {
   process(value) {
      if (!isNaN(value)) {
         if (this.empty)
            this.result = value;
         else if (value < this.result)
            this.result = value;
         this.empty = false;
      }
      else if (value != null)
         this.invalid = true;
   }

   getResult() {
      if (this.empty || this.invalid)
         return null;
      return this.result;
   }
}

Min.prototype.result = 0;
Min.prototype.empty = true;