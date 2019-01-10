import * as Cx from '../core';

type ShapeRender = (cx: number, cy: number, size: number, props?: Cx.Config, options?: Cx.Config) => JSX.Element;

export function registerShape(name: string, callback: (cx: number, cy: number, size: number) => any);

export function getShape(shapeName: string): string;

export function getAvailableShapes(): string[];

export const circle: ShapeRender;

export const square: ShapeRender;

export const bar: ShapeRender;

export const column: ShapeRender;

export const line: ShapeRender;

export const vline: ShapeRender;

export const triangle: ShapeRender;