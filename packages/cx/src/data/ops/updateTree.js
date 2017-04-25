import {updateArray} from './updateArray';

export function updateTree(array, updateCallback, itemFilter, childrenField) {
   return updateArray(array, (item) => {
      let updatedItem = updateCallback(item);
      if (updatedItem) {
         let children = updatedItem[childrenField];
         let updatedChildren = updateTree(children, updateCallback, itemFilter, childrenField);
         if (updatedChildren != children) {
            updatedItem = {
               ...updatedItem,
               [childrenField]: updatedChildren
            }
         }
      }
      return updatedItem;
   }, itemFilter);
}
