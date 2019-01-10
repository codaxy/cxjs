export function updateArray(array, updateCallback, itemFilter, removeFilter) {
   
   if (!array)
      return array;
   
   let newArray = [];
   let dirty = false;
   
   for (let index = 0; index < array.length; index++) {
      let item = array[index];
      if (removeFilter && removeFilter(item, index)) {
         dirty = true;
         continue;
      }
      if (!itemFilter || itemFilter(item, index)) {
         let newItem = updateCallback(item, index);
         newArray.push(newItem);
         if (newItem !== item)
            dirty = true;
      } else
         newArray.push(item);
   }
   return dirty ? newArray : array;
}
