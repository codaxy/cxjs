import * as Cx from "../core";
import { AccessorChain } from "../data/createAccessorModelProxy";

export function expr(code: string): Cx.Binding;
export function expr<V1, R>(arg1: AccessorChain<V1>, compute: (v1: V1) => R): (data: any) => R;
export function expr<V1, V2, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   compute: (v1: V1, v2: V2) => R
): (data: any) => R;

export function expr<V1, V2, V3, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   compute: (v1: V1, v2: V2, v3: V3) => R
): (data: any) => R;

export function expr<V1, V2, V3, V4, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4) => R
): (data: any) => R;
