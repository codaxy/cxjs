export function isArray<T = unknown>(x: unknown): x is T[] {
   return Array.isArray(x);
}
