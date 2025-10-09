export function isNonEmptyArray(x: any): x is [any, ...any] {
   return Array.isArray(x) && x.length > 0;
}
