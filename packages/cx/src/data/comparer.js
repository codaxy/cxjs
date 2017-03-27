import {getSelector} from './getSelector'

export function getComparer(sorters, dataAccessor) {
   var data = (sorters || []).map(s=> {
      var selector = getSelector(s.value); 
      return {
         getter: dataAccessor ? x => selector(dataAccessor(x)) : selector,
         factor: s.direction && s.direction[0].toLowerCase() == 'd' ? -1 : 1
      }
   });

   return function (a, b) {
      for (var i = 0; i < data.length; i++) {
         var d = data[i];
         var av = d.getter(a);
         var bv = d.getter(b);
         if (av < bv)
            return -d.factor;
         if (av > bv)
            return d.factor;
      }
      return 0;
   }
}

export function indexSorter(sorters, dataAccessor) {
   var cmp = getComparer(sorters, dataAccessor);
   return function (data) {
      var result = Array.from({length: data.length}, (v, k) => k);
      result.sort((ia, ib) => cmp(data[ia], data[ib]));
      return result;
   }
}

export function sorter(sorters, dataAccessor) {
   var cmp = getComparer(sorters, dataAccessor);

   return function (data) {
      var result = [...data];
      result.sort(cmp);
      return result;
   }
}
