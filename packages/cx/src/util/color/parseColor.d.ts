
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

/**
 * 
 * @param {string} color 
 * @returns {RGBColor|HSLColor}
 */
export function parseColor(color: string): RGBColor | HSLColor;

/**
 * 
 * @param {string} color 
 * @returns {RGBColor}
 */
export function parseHexColor(color: string): RGBColor;

/**
 * 
 * @param {string} color 
 * @returns {RGBColor}
 */
export function parseRgbColor(color: string): RGBColor;

/**
 * 
 * @param {string} color 
 * @returns {HSLColor}
 */
export function parseHslColor(color: string): HSLColor;