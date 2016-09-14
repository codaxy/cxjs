import {updateArray} from './updateArray';

export function updateTree(array, updateCallback, itemFilter, childrenProperty) {
   return updateArray(array, itemFilter, (item) => {
      var updatedItem = updateCallback(item);
      if (updatedItem) {
         var children = updatedItem[childrenProperty];
         var updatedChildren = updateTree(children, itemFilter, updateCallback, childrenProperty);
         if (updatedChildren != children) {
            updatedItem = {
               ...updatedItem,
               [childrenProperty]: updatedChildren
            }
         }
      }
      return updatedItem;
   });
}
