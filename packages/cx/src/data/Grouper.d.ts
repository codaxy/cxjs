import { StructuredProp, Record, StringProp } from '../core';

interface GroupingResult {
   key: Record,
   name: string,
   records: Record[],
   indexes: number[],
   aggregates: Record
}

export class Grouper {
   constructor(key: StructuredProp, aggregates?: StructuredProp, dataGetter?: (any) => any, nameGetter?: StringProp);

   reset();

   process(record: Record, index: number): void;

   processAll(records: Record[], indexes?: number[]): void;

   getResults(): GroupingResult[]
}
