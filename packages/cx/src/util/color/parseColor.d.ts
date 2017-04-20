/**
 * An object representing `rgba` color.
 * @typedef {Object} RGBColor
 * @property {string} type
 * @property {number} r
 * @property {number} g
 * @property {number} b
 * @property {number} a
 */
type RGBColor = { 
   type: 'rgba',
   r: number,
   g: number,
   b: number,
   a: number
}
/**
 * An object representing `hsla` color.
 * @typedef {Object} HSLColor
 * @property {string} type
 * @property {number} h
 * @property {number} s
 * @property {number} l
 * @property {number} a
 */
type HSLColor = {
   type: 'hsla',
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