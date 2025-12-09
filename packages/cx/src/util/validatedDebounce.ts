export function validatedDebounce<T extends (...args: any[]) => void>(
   callback: T,
   valueGetter: () => any,
   delay: number
): T & { reset: T } {
   let timer: ReturnType<typeof setTimeout> | undefined;
   let result = function (...args: Parameters<T>) {
      clearTimeout(timer);
      let prev = valueGetter();
      timer = setTimeout(function () {
         let now = valueGetter();
         if (prev !== now) return;
         callback(...args);
      }, delay);
   } as T & { reset: T };

   result.reset = function reset(...args: Parameters<T>) {
      clearTimeout(timer);
      callback(...args);
   } as T;

   return result;
}
