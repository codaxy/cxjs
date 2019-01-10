export function findTreeNode(array, criteria, childrenField = '$children') {
   if (!Array.isArray(array))
      return false;

   for (let i = 0; i < array.length; i++) {
      if (criteria(array[i]))
         return array[i];

      let child = findTreeNode(array[i][childrenField], criteria, childrenField);
      if (child)
         return child;
   }

   return false;
}
