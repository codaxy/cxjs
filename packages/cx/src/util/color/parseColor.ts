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
export function parseColor(color: string): RGBColor | HSLColor {

   if (!color)
      return null;

   if (color[0] == '#')
      return parseHexColor(color);

   if (color.indexOf('rgb') == 0)
      return parseRgbColor(color);

   if (color.indexOf('hsl') == 0)
      return parseHslColor(color);

   throw new Error(`Unknown color format: ${color}.`);
}

/**
 *
 * @param color
 * @returns {RGBColor}
 */
export function parseHexColor(color: string): RGBColor {

   if (!color)
      return null;

   if (color[0] != '#')
      throw new Error(`Invalid color ${color}.`);

   if (color.length == 4)
      return {
         type: 'rgba',
         r: parseInt(color.charAt(1), 16) * 0x11,
         g: parseInt(color.charAt(2), 16) * 0x11,
         b: parseInt(color.charAt(3), 16) * 0x11,
         a: 1
      };

   if (color.length != 7)
      throw new Error(`Invalid color ${color}.`);

   return {
      type: 'rgba',
      r: parseInt(color.substr(1, 2), 16),
      g: parseInt(color.substr(3, 2), 16),
      b: parseInt(color.substr(5, 2), 16),
      a: 1
   }
}

/**
 *
 * @param color
 * @returns {RGBColor}
 */
export function parseRgbColor(color: string): RGBColor {
   if (!color)
      return null;

   color = color.trim();
   var values;

   if (color.indexOf('rgba(') == 0) {
      values = color.substring(5, color.length - 1).split(',').map(x=>parseFloat(x.trim()));
      if (values.length != 4)
         throw new Error(`Invalid color ${color}.`);

      return {
         type: 'rgba',
         r: values[0],
         g: values[1],
         b: values[2],
         a: values[3]
      }
   }

   if (color.indexOf('rgb(') != 0)
      throw new Error(`Invalid color ${color}.`);

   values = color.substring(5, color.length - 1).split(',').map(x=>parseFloat(x.trim()));
   if (values.length != 3)
      throw new Error(`Invalid color ${color}.`);

   return {
      type: 'rgba',
      r: values[0],
      g: values[1],
      b: values[2],
      a: 1
   }
}

/**
 *
 * @param color
 * @returns {HSLColor}
 */
export function parseHslColor(color: string): HSLColor {
   if (!color)
      return null;

   color = color.trim();
   var values;

   if (color.indexOf('hsla(') == 0) {
      values = color.substring(5, color.length - 1).split(',').map(x=>parseFloat(x.trim()));
      if (values.length != 4)
         throw new Error(`Invalid color ${color}.`);

      return {
         type: 'hsla',
         h: values[0],
         s: values[1],
         l: values[2],
         a: values[3]
      }
   }

   if (color.indexOf('hsl(') != 0)
      throw new Error(`Invalid color ${color}.`);

   values = color.substring(5, color.length - 1).split(',').map(x=>parseFloat(x.trim()));
   if (values.length != 3)
      throw new Error(`Invalid color ${color}.`);

   return {
      type: 'hsla',
      h: values[0],
      s: values[1],
      l: values[2],
      a: 1
   }
}
