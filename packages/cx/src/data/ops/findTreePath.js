export function findTreePath(array, criteria, childrenField = "$children", currentPath = []) {
   if (!Array.isArray(array)) return false;

   for (let i = 0; i < array.length; i++) {
      currentPath.push(array[i]);

      if (criteria(array[i])) return currentPath;

      let childPath = findTreePath(array[i][childrenField], criteria, childrenField, currentPath);
      if (childPath) return childPath;

      currentPath.pop();
   }

   return false;
}
