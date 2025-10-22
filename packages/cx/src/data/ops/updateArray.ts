export function updateArray<T = any>(
   array: T[] | undefined,
   updateCallback: (item: T, index: number) => T,
   itemFilter?: null | ((item: T, index: number) => boolean),
   removeFilter?: (item: T, index: number) => boolean,
): T[] | undefined {
   if (!array) return array;

   const newArray: T[] = [];
   let dirty: boolean = false;

   for (let index = 0; index < array.length; index++) {
      const item = array[index];

      if (removeFilter && removeFilter(item, index)) {
         dirty = true;
         continue;
      }

      if (!itemFilter || itemFilter(item, index)) {
         const newItem = updateCallback(item, index);
         newArray.push(newItem);

         if (newItem !== item) dirty = true;
      } else {
         newArray.push(item);
      }
   }

   return dirty ? newArray : array;
}
