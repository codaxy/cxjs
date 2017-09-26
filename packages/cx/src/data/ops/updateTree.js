import {updateArray} from './updateArray';

export function updateTree(array, updateCallback, itemFilter, childrenField) {
   return updateArray(array, item => {
      if (itemFilter(item))
         return updateCallback(item);

      let children = item[childrenField];
      if (!Array.isArray(children))
         return item;

      let updatedChildren = updateTree(
         children,
         updateCallback,
         itemFilter,
         childrenField
      );

      if (updatedChildren != children)
         return { ...item, [childrenField]: updatedChildren };

      return item;
   });
}
