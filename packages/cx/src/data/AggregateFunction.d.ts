interface Aggregator {
   process(value: number, weight?: number);
   getResult(): number
}

export class AggregateFunction {
   static sum(): Aggregator;

   static avg(): Aggregator;

   static count(): Aggregator;

   static distinct(): Aggregator;

   static min(): Aggregator;

   static max(): Aggregator;
}