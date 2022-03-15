export interface AccessorChain<V> {}

export function isAccessorChain(value: any): boolean;
export function isAccessorChain<V>(value: AccessorChain<V>): true;

export type AccessorModelProps<M> = {
   [prop in keyof M]: M[prop] extends string | number | Date | boolean
      ? AccessorChain<M[prop]>
      : AccessorModel<M[prop]>;
};

export type AccessorModel<M> = AccessorChain<M> & AccessorModelProps<M>;

export function createAccessorModelProxy<M>(): AccessorModel<M>;

export function memo<V1, R>(arg1: AccessorChain<V1>, compute: (v1: V1) => R): (data: any) => R;
export function memo<V1, V2, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   compute: (v1: V1, v2: V2) => R
): (data: any) => R;

export function expr<V1, R>(arg1: AccessorChain<V1>, compute: (v1: V1) => R): (data: any) => R;
