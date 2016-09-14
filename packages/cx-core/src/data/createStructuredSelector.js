export function createStructuredSelector(selector) {
   var keys = Object.keys(selector);
   var lastResult = {};
   return function (data) {
      var result = lastResult;
      for (var i = 0; i < keys.length; i++) {
         var k = keys[i];
         var v = selector[k](data);
         if (result == lastResult && v !== lastResult[k]) {
            result = {};
            for (let j = 0; j < i; j++)
               result[keys[j]] = lastResult[keys[j]];
         }
         result[k] = v;
      }
      return lastResult = result;
   }
}
