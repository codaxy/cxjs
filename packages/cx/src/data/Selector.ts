export interface Selector<T = any> {
   (data: any): T;
   memoize?: (warmupData?: unknown) => Selector<T>;
}

export interface CanMemoize<T = any> {
   memoize(warmupData?: unknown): Selector<T>;
}

export type MemoSelector<T = any> = Selector<T> & CanMemoize<Selector<T>>;
