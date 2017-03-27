export function isPromise(x) {
   return typeof x == 'object' && x && typeof x.then == 'function';
}
