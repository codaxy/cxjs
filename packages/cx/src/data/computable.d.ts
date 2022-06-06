import { AccessorChain, Record } from "../core";

interface Computable<V = any> {
   (data: Record): V;
   memoize(warmupData?: Record): (data: Record) => any;
}

export function computable(callback: () => any): Computable;
export function computable(p1: string, computeFn: (v1: any) => any): Computable;
export function computable(p1: string, p2: string, computeFn: (v1: any, v2: any) => any): Computable;
export function computable(
   p1: string,
   p2: string,
   p3: string,
   computeFn: (v1: any, v2: any, v3: any) => any
): Computable;
export function computable(
   p1: string,
   p2: string,
   p3: string,
   p4: string,
   computeFn: (v1: any, v2: any, v3: any, v4: any) => any
): Computable;

export function computable<V1, R>(arg1: AccessorChain<V1>, compute: (v1: V1) => R): Computable<R>;
export function computable<V1, V2, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   compute: (v1: V1, v2: V2) => R
): Computable<R>;

export function computable<V1, V2, V3, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   compute: (v1: V1, v2: V2, v3: V3) => R
): Computable<R>;

export function computable<V1, V2, V3, V4, R>(
   arg1: AccessorChain<V1>,
   arg2: AccessorChain<V2>,
   arg3: AccessorChain<V3>,
   arg4: AccessorChain<V4>,
   compute: (v1: V1, v2: V2, v3: V3, v4: V4) => R
): Computable<R>;
