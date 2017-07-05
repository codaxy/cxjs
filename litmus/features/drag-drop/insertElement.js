export function insertElement(array, index, ...args) {
   if (index < 0)
      index += array.length + 1;
   return [...array.slice(0, index), ...args, ...array.slice(index)];
}
