import { Bind, AccessorChain } from "../core";

export function bind(path: string, defaultValue?: any): Bind;
export function bind<T>(chain: AccessorChain<T>, defaultValue?: any): Bind;
