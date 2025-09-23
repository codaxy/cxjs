export function isObject(o: unknown): o is object {
   return o !== null && typeof o === 'object';
}
