/**
 * An object representing `rgba` color.
 * @typedef RGBColor
 * @property type
 * @property  r
 * @property  g
 * @property  b
 * @property  a
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
 * @typedef HSLColor
 * @property type
 * @property h
 * @property s
 * @property l
 * @property a
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
 * @param  color 
 * @returns {RGBColor|HSLColor}
 */
export function parseColor(color: string): RGBColor | HSLColor;

/**
 * 
 * @param color 
 * @returns {RGBColor}
 */
export function parseHexColor(color: string): RGBColor;

/**
 * 
 * @param color 
 * @returns {RGBColor}
 */
export function parseRgbColor(color: string): RGBColor;

/**
 * 
 * @param color 
 * @returns {HSLColor}
 */
export function parseHslColor(color: string): HSLColor;