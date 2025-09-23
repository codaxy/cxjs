import { updateArray } from "./updateArray";

export function updateTree<T extends Record<string, any>>(
   array: T[] | undefined,
   updateCallback: (item: T) => T,
   itemFilter: ((item: T) => boolean) | null,
   childrenField: keyof T,
   removeFilter?: (item: T) => boolean,
): T[] | undefined {
   return updateArray(
      array,
      (item: T) => {
         if (!itemFilter || itemFilter(item)) {
            item = updateCallback(item);
         }

         const children = item[childrenField];

         if (!Array.isArray(children)) {
            return item;
         }

         const updatedChildren = updateTree(children, updateCallback, itemFilter, childrenField, removeFilter);

         if (updatedChildren != children) {
            return { ...item, [childrenField]: updatedChildren };
         }

         return item;
      },
      null,
      removeFilter,
   );
}
