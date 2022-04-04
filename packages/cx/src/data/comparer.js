import { getSelector } from "./getSelector";
import { isDefined } from "../util/isDefined";
import { defaultCompare } from "./defaultCompare";

export function getComparer(sorters, dataAccessor, comparer) {
   let data = (sorters || []).map((s) => {
      let selector = isDefined(s.value) ? getSelector(s.value) : s.field ? (x) => x[s.field] : () => null;
      return {
         getter: dataAccessor ? (x) => selector(dataAccessor(x)) : selector,
         factor: s.direction && s.direction[0].toLowerCase() == "d" ? -1 : 1,
         compare: s.comparer || s.compare || comparer || defaultCompare,
      };
   });

   return function (a, b) {
      let d, av, bv;
      for (let i = 0; i < data.length; i++) {
         d = data[i];
         av = d.getter(a);
         bv = d.getter(b);

         // show nulls always on the bottom
         if (av == null && bv == null) return 0;
         if (av == null) return 1;
         if (bv == null) return -1;

         let r = d.compare(av, bv);
         if (r == 0) continue;
         return d.factor * r;
      }
      return 0;
   };
}

export function indexSorter(sorters, dataAccessor, compare) {
   let cmp = getComparer(sorters, dataAccessor, compare);
   return function (data) {
      let result = Array.from({ length: data.length }, (v, k) => k);
      result.sort((ia, ib) => cmp(data[ia], data[ib]));
      return result;
   };
}

export function sorter(sorters, dataAccessor, compare) {
   let cmp = getComparer(sorters, dataAccessor, compare);

   return function (data) {
      let result = [...data];
      result.sort(cmp);
      return result;
   };
}
