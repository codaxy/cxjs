import {bump} from '../routes/hmr.js';
let activeStyle = null;
import {Icon} from 'cx/widgets';

export function loadTheme(name) {

   if (activeStyle)
      activeStyle.unuse();

   let style = themes[name];
   activeStyle = style;
   style.use();

   Icon.restoreDefaultIcons();

   if (callbacks[name])
      callbacks[name]();

   bump();
}

const themes = {};
const callbacks = {};

export function registerTheme(name, style, callback) {
   themes[name] = style;
   callbacks[name] = callback;
}