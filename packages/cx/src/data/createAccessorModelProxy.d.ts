import { AccessorChain } from "../core";

export function isAccessorChain(value: any): boolean;
export function isAccessorChain<V>(value: any): value is AccessorChain<V>;

export function createAccessorModelProxy<M>(): AccessorChain<M>;
