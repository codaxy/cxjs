export function debounce(callback, delay) {
   let timer;

   return function () {
      let context = this,
         args = arguments;

      clearTimeout(timer);

      timer = setTimeout(function () {
         callback.apply(context, args);
      }, delay);
   };
}
