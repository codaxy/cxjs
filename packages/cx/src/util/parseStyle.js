export function parseStyle(str) {
   if (typeof str != 'string')
      return str;

   var style = {},
      parts = str.split(';');

   for (var i = 0; i < parts.length; i++) {

      let part = parts[i];

      let colonIndex = part.indexOf(':');
      if (colonIndex == -1)
         continue;

      let name = part.substring(0, colonIndex).trim();
      let value = part.substring(colonIndex + 1).trim();

      name = name.split('-')
         .map((p, i)=>(i == 0 ? p : (p[0].toUpperCase() + p.substring(1))))
         .join('');
      style[name] = value;
   }

   return style;
}
