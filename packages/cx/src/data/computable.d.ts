import * as Cx from "../core";

interface Computable {
   (data: Cx.Record): any;
   memoize(warmupData?: Cx.Record): (data: Cx.Record) => any;
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
