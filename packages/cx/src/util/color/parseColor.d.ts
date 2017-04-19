import * as Cx from '../core';

type RGBColor = { 
   type: string,
   r: number,
   g: number,
   b: number,
   a: number
}

type HSLColor = {
   type: string,
   h: number,
   s: number,
   l: number,
   a: number
}

export function parseColor(color: string): RGBColor | HSLColor;

export function parseHexColor(color: string): RGBColor;

export function parseRgbColor(color: string): RGBColor;

export function parseHslColor(color: string): HSLColor;