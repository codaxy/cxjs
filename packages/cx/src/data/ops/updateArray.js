export function updateArray(array, updateCallback, itemFilter) {
   
   if (!array)
      return array;
   
   let newArray = [];
   let dirty = false;
   
   array.forEach(item => {
      if (!itemFilter || itemFilter(item)) {
         let newItem = updateCallback(item);
         newArray.push(newItem);
         if (newItem !== item)
            dirty = true;
      } else
         newArray.push(item);
   });

   return dirty ? newArray : array;
}
