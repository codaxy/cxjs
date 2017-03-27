export function diffArrays(oldArray, newArray, key) {
   if (!key)
      key = e => e;

   var map = new Map();

   for (let i = 0; i < oldArray.length; i++)
      map.set(key(oldArray[i]), oldArray[i]);

   var added = [],
      changed = [],
      unchanged = [];

   for (let i = 0; i < newArray.length; i++) {
      let el = newArray[i];
      let k = key(el);
      let old = map.get(k);
      if (typeof old == 'undefined')
         added.push(el);
      else {
         map.delete(k);
         if (el == old)
            unchanged.push(el);
         else changed.push({
            before: old,
            after: el
         });
      }
   }

   var removed = Array.from(map.values());

   return {
      added,
      changed,
      unchanged,
      removed
   }
}
