import { getSelector } from "./getSelector";
import { isDefined } from "../util/isDefined";
import { defaultCompare } from "./defaultCompare";
import type { CollatorOptions, Sorter } from "../ui/Prop";

export interface ExtendedSorter extends Sorter {
   comparer?: (a: any, b: any) => number;
   compare?: (a: any, b: any) => number;
   sortOptions?: CollatorOptions;
}

export function getComparer(
   sorters: ExtendedSorter[],
   dataAccessor?: (x: any) => any,
   comparer?: (a: any, b: any) => number,
): (a: any, b: any) => number {
   let resolvedSorters = (sorters || []).map((s) => {
      let selector = isDefined(s.value)
         ? getSelector(s.value)
         : s.field
           ? (x: Record<string, any>) => x[s.field!]
           : () => null;
      return {
         getter: dataAccessor ? (x: any) => selector(dataAccessor(x)) : selector,
         factor: s.direction && s.direction[0].toLowerCase() == "d" ? -1 : 1,
         compare: s.comparer || s.compare || comparer || defaultCompare,
      };
   });

   return function (a, b) {
      let d, av, bv;
      for (let i = 0; i < resolvedSorters.length; i++) {
         d = resolvedSorters[i];
         av = d.getter(a);
         bv = d.getter(b);

         // show nulls always on the bottom
         if (av == null) {
            if (bv == null) continue;
            else return 1;
         }
         if (bv == null) return -1;

         let r = d.compare(av, bv);
         if (r == 0) continue;
         return d.factor * r;
      }
      return 0;
   };
}

export function indexSorter(
   sorters: ExtendedSorter[],
   dataAccessor?: (x: any) => any,
   compare?: (a: any, b: any) => number,
): (data: any[]) => number[] {
   let cmp = getComparer(sorters, dataAccessor, compare);
   return function (data) {
      let result = Array.from({ length: data.length }, (v, k) => k);
      result.sort((ia, ib) => cmp(data[ia], data[ib]));
      return result;
   };
}

export function sorter(
   sorters: ExtendedSorter[],
   dataAccessor?: (x: any) => any,
   compare?: (a: any, b: any) => number,
): (data: any[]) => any[] {
   let cmp = getComparer(sorters, dataAccessor, compare);

   return function (data) {
      let result = [...data];
      result.sort(cmp);
      return result;
   };
}
