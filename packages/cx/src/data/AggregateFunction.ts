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

   static last() {
      return new LastValue();
   }
}

class Sum {
   result: number = 0;
   empty: boolean = true;
   invalid?: boolean;

   process(value: number): void {
      this.empty = false;
      if (!isNaN(value)) this.result += value;
      else this.invalid = true;
   }

   getResult() {
      if (this.invalid) return null;
      return this.result;
   }
}

Sum.prototype.result = 0;
Sum.prototype.empty = true;

class Avg {
   result: number = 0;
   count: number = 0;
   empty: boolean = true;
   invalid?: boolean;

   process(value: number, count: number = 1): void {
      this.empty = false;
      if (!isNaN(value) && !isNaN(count)) {
         this.result += value * count;
         this.count += count;
      } else this.invalid = true;
   }

   getResult() {
      if (this.empty || this.invalid || this.count == 0) return null;
      return this.result / this.count;
   }
}

Avg.prototype.result = 0;
Avg.prototype.count = 0;
Avg.prototype.empty = true;

class Count {
   result: number = 0;

   process(value: any): void {
      if (value != null) this.result++;
   }

   getResult() {
      return this.result;
   }
}

Count.prototype.result = 0;

class Distinct {
   values: {[key: string]: boolean} = {};
   empty: boolean = true;
   result: number = 0;
   invalid?: boolean;

   constructor() {
      this.values = {};
   }

   process(value: any): void {
      if (value == null || this.values[value]) return;
      this.values[value] = true;
      this.empty = false;
      this.result++;
   }

   getResult() {
      if (this.empty || this.invalid) return null;
      return this.result;
   }
}

Distinct.prototype.result = 0;
Distinct.prototype.empty = true;

class Max {
   result: number = 0;
   empty: boolean = true;
   invalid?: boolean;

   process(value: number): void {
      if (!isNaN(value)) {
         if (this.empty) this.result = value;
         else if (value > this.result) this.result = value;
         this.empty = false;
      } else if (value != null) this.invalid = true;
   }

   getResult() {
      if (this.empty || this.invalid) return null;
      return this.result;
   }
}

Max.prototype.result = 0;
Max.prototype.empty = true;

class Min {
   result: number = 0;
   empty: boolean = true;
   invalid?: boolean;

   process(value: number): void {
      if (!isNaN(value)) {
         if (this.empty) this.result = value;
         else if (value < this.result) this.result = value;
         this.empty = false;
      } else if (value != null) this.invalid = true;
   }

   getResult() {
      if (this.empty || this.invalid) return null;
      return this.result;
   }
}

Min.prototype.result = 0;
Min.prototype.empty = true;

class LastValue {
   result: any = null;

   process(value: any): void {
      this.result = value;
   }

   getResult() {
      return this.result;
   }
}

LastValue.prototype.result = null;
