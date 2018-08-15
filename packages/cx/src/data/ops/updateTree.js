import {updateArray} from './updateArray';

export function updateTree(array, updateCallback, itemFilter, childrenField, removeFilter) {
   return updateArray(array, item => {
      if (!itemFilter || itemFilter(item))
         item = updateCallback(item);

      let children = item[childrenField];
      if (!Array.isArray(children))
         return item;

      let updatedChildren = updateTree(
         children,
         updateCallback,
         itemFilter,
         childrenField,
         removeFilter
      );

      if (updatedChildren != children)
         return { ...item, [childrenField]: updatedChildren };

      return item;
   }, null, removeFilter);
}
