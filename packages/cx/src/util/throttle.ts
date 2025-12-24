/**
 * Returns a function, that, after it is invoked, will trigger the `callback` function,
 * after the `delay` amount of milliseconds has passed. During that time, all subsequent calls are
 * ignored. All arguments are passed to the `callback` function.
 * @param callback
 * @param delay - Delay in milliseconds.
 * @returns {Function}
 */
export function throttle<T extends (...args: any[]) => void>(callback: T, delay: number): T {
   let timer: ReturnType<typeof setTimeout> | null;

   return function (this: any, ...args: any[]) {
      const context = this;

      if (!timer)
         timer = setTimeout(function () {
            callback.apply(context, args);
            timer = null;
         }, delay);
   } as T;
}
