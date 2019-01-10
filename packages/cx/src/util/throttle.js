export function throttle(callback, delay) {
   let timer, context, args;

   return function () {
      context = this;
      args = arguments;

      if (!timer)
         timer = setTimeout(function () {
            callback.apply(context, args);
            timer = null;
         }, delay);
   };
}
