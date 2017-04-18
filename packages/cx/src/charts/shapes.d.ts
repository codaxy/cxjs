import * as Cx from '../core';

export function registerShape(name: string, callback: string); 

export function getShape(shapeName: string): string;

export function getAvailableShapes(): string[];

export function circle(cx: number, cy: number, size: number, props, options):

export function square(cx, cy, size, props, options):

export function bar(cx, cy, size, props, options):

export function column(cx, cy, size, props, options):

export function line(cx, cy, size, props, options):

export function vline(cx, cy, size, props, options):

export function triangle(cx, cy, size, props, options):