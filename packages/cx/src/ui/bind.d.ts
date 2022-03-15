import { Binding } from "../core";

import { AccessorChain } from "../data/createAccessorModelProxy";

export function bind(path: string, defaultValue?: any): Binding;
export function bind(chain: AccessorChain<any>, defaultValue?: any): Binding;
