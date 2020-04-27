export function validatedDebounce(callback, valueGetter, delay) {
   let timer;
   let result = function (...args) {
      clearTimeout(timer);
      let prev = valueGetter();
      timer = setTimeout(function () {
         let now = valueGetter();
         if (prev !== now) return;
         callback(...args);
      }, delay);
   };

   result.reset = function reset(...args) {
      clearTimeout(timer);
      callback(...args);
   };

   return result;
}
