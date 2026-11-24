import { getSelector } from "./getSelector";
import { isDefined } from "../util/isDefined";
import { defaultCompare } from "./defaultCompare";
import type { Sorter } from "../ui/Prop";

export interface ComparerSorter extends Sorter {
   /** Function used to compare the values of this sorter, instead of the default comparison. */
   comparer?: (a: any, b: any) => number;
   /** Alias of `comparer`. */
   compare?: (a: any, b: any) => number;
}

/** @deprecated Use ComparerSorter. Collator options are applied by data adapters; see ExtendedSorter in cx/ui. */
export type ExtendedSorter = ComparerSorter;

export function getComparer(
   sorters: ComparerSorter[],
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
         nullValue: s.nullValue,
         nulls: s.nullsFirst ? -1 : 1,
      };
   });

   return function (a, b) {
      let d, av, bv;
      for (let i = 0; i < resolvedSorters.length; i++) {
         d = resolvedSorters[i];
         av = d.getter(a) ?? d.nullValue;
         bv = d.getter(b) ?? d.nullValue;

         // nulls are placed first or last, independent of the sort direction
         if (av == null) {
            if (bv == null) continue;
            else return d.nulls;
         }
         if (bv == null) return -d.nulls;

         let r = d.compare(av, bv);
         if (r == 0) continue;
         return d.factor * r;
      }
      return 0;
   };
}

export function indexSorter(
   sorters: ComparerSorter[],
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
   sorters: ComparerSorter[],
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
