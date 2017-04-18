import * as Cx from '../core';

interface IShape {
   (cx: number, cy: number, size: number, props?: Cx.Config, options?: Cx.Config): any;
}

export function registerShape(name: string, callback: (cx: number) => any); 

export function getShape(shapeName: string): string;

export function getAvailableShapes(): string[];

export const circle: IShape;

export function square(cx, cy, size, props, options):

export function bar(cx, cy, size, props, options):

export function column(cx, cy, size, props, options):

export function line(cx, cy, size, props, options):

export function vline(cx, cy, size, props, options):

export function triangle(cx, cy, size, props, options):