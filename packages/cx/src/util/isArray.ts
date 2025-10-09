export function isArray<T>(x: T): x is Array<T> {
   return Array.isArray(x);
}
