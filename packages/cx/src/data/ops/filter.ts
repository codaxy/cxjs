export function filter<T = any>(array: T[], callback: (item: T, index: number, array: T[]) => boolean): T[] {
   if (array == null) return array;

   const result = array.filter(callback);

   if (result.length === array.length) return array;

   return result;
}
