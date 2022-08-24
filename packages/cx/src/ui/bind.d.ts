import { Binding, AccessorChain } from "../core";

export function bind(path: string, defaultValue?: any): Binding;
export function bind<T>(chain: AccessorChain<T>, defaultValue?: any): Binding;
