import { AccessorChain } from "../core";

export function isAccessorChain(value: any): boolean;
export function isAccessorChain<V>(value: AccessorChain<V>): true;

export function createAccessorModelProxy<M>(): AccessorChain<M>;
