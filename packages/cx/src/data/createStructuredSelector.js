export function createStructuredSelector(selector, constants) {
   let lastResult = Object.assign({}, constants);

   let keys = Object.keys(selector);
   if (keys.length == 0)
      return () => lastResult;

   return function (data) {
      let result = lastResult, k, v, i;
      for (i = 0; i < keys.length; i++) {
         k = keys[i];
         v = selector[k](data);
         if (result === lastResult) {
            if (v === lastResult[k])
               continue;
            result = Object.assign({}, lastResult);
         }
         result[k] = v;
      }
      return lastResult = result;
   }
}
