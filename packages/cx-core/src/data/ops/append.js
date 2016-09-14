export function append(array, ...items) {
   if (items.length == 0)
      return array;
   return [...array, ...items];
}
