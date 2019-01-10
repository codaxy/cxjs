import {VDOM} from '../ui/Widget';
import {debug} from '../util/Debug';

var shapes =  {};
var warnings = {};

export function registerShape(name, callback) {
   shapes[name] = callback;
}

export function getShape(shapeName) {
   if (shapes[shapeName])
      return shapes[shapeName];

   if (!warnings[shapeName]) {
      warnings[shapeName] = true;
      debug(`Unknown shape '${shapeName}'. Using square instead.`);
   }

   return shapes['square'];
}

export function getAvailableShapes() {
   return Object.keys(shapes);
}

export function circle(cx, cy, size, props, options) {
   return <circle {...props} cx={cx} cy={cy} r={size/2} />
}
registerShape('circle', circle);

export function square(cx, cy, size, props, options) {
   size *= 0.9;
   return <rect {...props} x={cx-size/2} y={cy-size/2} width={size} height={size} />
}
registerShape('square', square);
registerShape('rect', square);

export function bar(cx, cy, size, props, options) {
   size *= 0.9;
   return <rect {...props} x={cx-size/2} y={cy-size/4} width={size} height={size/2} />
}
registerShape('bar', bar);

export function column(cx, cy, size, props, options) {
   size *= 0.9;
   return <rect {...props} x={cx-size/4} y={cy-size/2} width={size/2} height={size} />
}
registerShape('column', column);

export function line(cx, cy, size, props, options) {
   size *= 0.9;
   return <line {...props} x1={cx-size/2} y1={cy} x2={cx+size/2} y2={cy} />
}
registerShape('line', line);
registerShape('hline', line);

export function vline(cx, cy, size, props, options) {
   size *= 0.9;
   return <line {...props} x1={cx} y1={cy - size / 2} x2={cx} y2={cy + size / 2}/>
}
registerShape('vline', vline);



export function triangle(cx, cy, size, props, options) {
   size *= 1.29;
   var d = '';
   var cos = Math.cos(Math.PI / 6);
   var sin = Math.sin(Math.PI / 6);
   d += `M ${cx} ${cy - size/2} `;
   d += `L ${cx + cos * size / 2} ${cy + sin * size / 2} `;
   d += `L ${cx - cos * size / 2} ${cy + sin * size / 2} `;
   d += `Z`;
   return <path {...props} d={d} />
}

registerShape('triangle', triangle);

