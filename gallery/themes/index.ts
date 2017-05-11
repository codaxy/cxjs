import {bump} from '../routes/hmr.js'
let activeStyle = null;

export function loadTheme(name) {

   if (activeStyle)
      activeStyle.unuse();

   let style = themes[name];
   activeStyle = style;
   style.use();

   bump();
}

const themes = {};

export function registerTheme(name, style) {
   themes[name] = style;
}