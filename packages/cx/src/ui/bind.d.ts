import { Binding, AccessorChain } from "../core";

export function bind(path: string, defaultValue?: any): Binding;
export function bind(chain: AccessorChain<any>, defaultValue?: any): Binding;
