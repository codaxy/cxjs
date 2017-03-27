export function createStructuredSelector(selector, constants) {
   let lastResult = Object.assign({}, constants);

   let keys = Object.keys(selector);
   if (keys.length == 0)
      return () => lastResult;

   return function (data) {
      let result = lastResult, k, v, i, j;
      for (i = 0; i < keys.length; i++) {
         k = keys[i];
         v = selector[k](data);
         if (result == lastResult && v !== lastResult[k]) {
            result = Object.assign({}, constants);
            for (j = 0; j < i; j++)
               result[keys[j]] = lastResult[keys[j]];
         }
         result[k] = v;
      }
      return lastResult = result;
   }
}
