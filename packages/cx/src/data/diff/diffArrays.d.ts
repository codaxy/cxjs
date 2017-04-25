import { Record } from '../../core';

interface BeforeAfterPair {
   before: Record,
   after: Record
}

interface ArrayDiff {
   added: Record[],
   unchanged: Record[],
   removed: Record[],
   changed: BeforeAfterPair[]
}

export function diffArrays(oldArray: Record[], newArray: Record[], keyFn: (Record) => any) : ArrayDiff;
