import * as Cx from '../core';

export function computable(callback: () => any) : any;
export function computable(p1: string, computeFn: (v1: any) => any) : any;
export function computable(p1: string, p2: string, computeFn: (v1: any, v2: any) => any) : any;
export function computable(p1: string, p2: string, p3: string, computeFn: (v1: any, v2: any, v3: any) => any) : any;
export function computable(p1: string, p2: string, p3: string, p4: string, computeFn: (v1: any, v2: any, v3: any, v4: any) => any) : any;
