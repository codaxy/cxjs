export function updateArray(array, updateCallback, itemFilter) {
   var newArray = [];
   var dirty = false;
   array.forEach(item => {
      if (!itemFilter || itemFilter(item)) {
         var newItem = updateCallback(item);
         newArray.push(newItem);
         if (newItem !== item)
            dirty = true;
      } else
         newArray.push(item);
   });

   return dirty ? newArray : array;
}
