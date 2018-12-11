export function insertElement(array, index, ...args) {
   return [...array.slice(0, index), ...args, ...array.slice(index)];
}