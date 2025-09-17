//@ts-nocheck
export function debounce(callback, delay) {
   let timer;

   let result = function (...args) {
      let context = this;
      clearTimeout(timer);
      timer = setTimeout(function () {
         callback.apply(context, args);
      }, delay);
   };

   result.reset = function reset(...args) {
      clearTimeout(timer);
      callback.apply(this, args);
   };

   return result;
}
