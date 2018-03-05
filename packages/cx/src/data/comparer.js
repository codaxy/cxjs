import {getSelector} from './getSelector'
import {isDefined} from "../util/isDefined";

export function getComparer(sorters, dataAccessor) {
   let data = (sorters || []).map(s => {
      let selector = isDefined(s.value) ? getSelector(s.value) : s.field ? x => x[s.field] : () => null;
      return {
         getter: dataAccessor ? x => selector(dataAccessor(x)) : selector,
         factor: s.direction && s.direction[0].toLowerCase() == 'd' ? -1 : 1
      }
   });

   return function (a, b) {
      let d, av, bv;
      for (let i = 0; i < data.length; i++) {
         d = data[i];
         av = d.getter(a);
         bv = d.getter(b);
         if (av == null) {
            if (bv == null)
               return 0;
            return -d.factor;
         }
         else {
            if (bv == null)
               return d.factor;

            if (av < bv)
               return -d.factor;

            if (av > bv)
               return d.factor;
         }
      }
      return 0;
   }
}

export function indexSorter(sorters, dataAccessor) {
   let cmp = getComparer(sorters, dataAccessor);
   return function (data) {
      let result = Array.from({length: data.length}, (v, k) => k);
      result.sort((ia, ib) => cmp(data[ia], data[ib]));
      return result;
   }
}

export function sorter(sorters, dataAccessor) {
   let cmp = getComparer(sorters, dataAccessor);

   return function (data) {
      let result = [...data];
      result.sort(cmp);
      return result;
   }
}
