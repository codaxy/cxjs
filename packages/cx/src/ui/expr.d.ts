import { AccessorChain, Selector, Expr } from "../core";
import { AccessorModel } from "../data/createAccessorModelProxy";

export function expr(code: string): Expr;
export function expr<V1, R>(arg1: AccessorChain<V1> | AccessorModel<V1>, compute: (v1: V1) => R): Selector<R>;
export function expr<V1, V2, R>(
   arg1: AccessorChain<V1> | AccessorModel<V1>,
   arg2: AccessorChain<V2> | AccessorModel<V2>,
   compute: (v1: V1, v2: V2) => R
): Selector<R>;

export function expr<V1, V2, V3, R>(
   arg1: AccessorChain<V1> | AccessorModel<V1>,
   arg2: AccessorChain<V2> | AccessorModel<V2>,
   arg3: AccessorChain<V3> | AccessorModel<V3>,
   compute: (v1: V1, v2: V2, v3: V3) => R
): Selector<R>;

export function expr<V1, V2, V3, V4, R>(
   arg1: AccessorChain<V1> | AccessorModel<V1>,
   arg2: AccessorChain<V2> | AccessorModel<V2>,
   arg3: AccessorChain<V3> | AccessorModel<V3>,
   arg4: AccessorChain<V4> | AccessorModel<V4>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4) => R
): Selector<R>;
