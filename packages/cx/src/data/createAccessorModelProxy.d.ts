import { AccessorChain } from "../core";

export function isAccessorChain(value: any): boolean;
export function isAccessorChain<V>(value: AccessorChain<V>): true;

export type AccessorModelProps<M> = {
   [prop in keyof M]: M[prop] extends string | number | Date | boolean
      ? AccessorChain<M[prop]>
      : AccessorModel<M[prop]>;
};

export type AccessorModel<M> = AccessorChain<M> & AccessorModelProps<M>;

export function createAccessorModelProxy<M>(): AccessorModel<M>;
