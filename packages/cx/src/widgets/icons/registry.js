import {isFunction} from '../../util/isFunction';

let icons = {};
let iconFactory = null;
let defaultIcons = {};

let unregisteredDefaultIcons = {};

export function registerIcon(name, icon, defaultIcon = false) {
   if (!defaultIcon || !unregisteredDefaultIcons[name])
      icons[name] = icon;

   if (!defaultIcon)
      unregisteredDefaultIcons[name] = true;
   else
      defaultIcons[name] = icon;

   return props => renderIcon(name, props);
}

export function unregisterIcon(...args) {
   args.forEach(name => {
      delete icons[name];
      unregisteredDefaultIcons[name] = true;
   });
}

export function renderIcon(name, props) {

   if (isFunction(name))
      return name(props);

   if (icons[name])
      return icons[name](props);

   if (iconFactory)
      return iconFactory(name, props);

   return null;
}

export function clearIcons() {
   icons = {};
}

export function registerIconFactory(factory) {
   iconFactory = factory;
}

export function restoreDefaultIcons() {
   icons = {
      ...defaultIcons
   }
}