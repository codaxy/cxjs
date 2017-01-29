export function insertElement(array, index, element) {
   return [...array.slice(0, index), element, ...array.slice(index)];
}
