export function append(array, ...items) {
   if (items.length == 0)
      return array;
   if (!array)
      return items;
   return [...array, ...items];
}
