let activeStyle = null;

export function loadTheme(name) {

   if (activeStyle)
      activeStyle.unuse();

   let style = themes[name];
   activeStyle = style;
   style.use();
}

const themes = {};

export function registerTheme(name, style) {
   themes[name] = style;
}