export interface Selector<T = any> {
   (data: any): T;
   memoize?: (warmupData?: unknown) => Selector<T>;
}
