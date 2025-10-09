/**
 * Returns a function, that, after it is invoked, will trigger the `callback` function,
 * after the `delay` amount of milliseconds has passed. During that time, all subsequent calls are
 * ignored. All arguments are passed to the `callback` function.
 * @param callback
 * @param delay - Delay in milliseconds.
 * @returns {Function}
 */
export function throttle(callback: (...args: any[]) => void, delay: number): (...args: any[]) => void {
   let timer: ReturnType<typeof setTimeout> | null, context: any, args: IArguments;

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
