export function updateArray(array, updateCallback, itemFilter) {
   
   if (!array)
      return array;
   
   let newArray = [];
   let dirty = false;
   
   array.forEach((item, index) => {
      if (!itemFilter || itemFilter(item, index)) {
         let newItem = updateCallback(item, index);
         newArray.push(newItem);
         if (newItem !== item)
            dirty = true;
      } else
         newArray.push(item);
   });

   return dirty ? newArray : array;
}
