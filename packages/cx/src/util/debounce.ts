export interface DebouncedFunction<T extends (...args: any[]) => any> {
   (...args: Parameters<T>): void;
   reset(...args: Parameters<T>): void;
}

export function debounce<T extends (...args: any[]) => any>(
   callback: T,
   delay: number
): DebouncedFunction<T> {
   let timer: ReturnType<typeof setTimeout> | undefined;

   const result = function (this: any, ...args: Parameters<T>): void {
      const context = this;
      clearTimeout(timer);
      timer = setTimeout(() => {
         callback.apply(context, args);
      }, delay);
   } as DebouncedFunction<T>;

   result.reset = function (this: any, ...args: Parameters<T>): void {
      clearTimeout(timer);
      callback.apply(this, args);
   };

   return result;
}
