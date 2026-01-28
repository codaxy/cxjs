export function insertElement<T>(array: T[], index: number, ...elements: T[]): T[] {
   return [...array.slice(0, index), ...elements, ...array.slice(index)];
}
