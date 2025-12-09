import { isFunction } from '../../util/isFunction';

type IconRenderer = (props: Record<string, any>) => React.ReactNode;
type IconFactory = (name: string, props: Record<string, any>) => React.ReactNode;

let icons: Record<string, IconRenderer> = {};
let iconFactory: IconFactory | null = null;
let defaultIcons: Record<string, IconRenderer> = {};

let unregisteredDefaultIcons: Record<string, boolean> = {};

export function registerIcon(name: string, icon: IconRenderer, defaultIcon = false): IconRenderer {
   if (!defaultIcon || !unregisteredDefaultIcons[name])
      icons[name] = icon;

   if (!defaultIcon)
      unregisteredDefaultIcons[name] = true;
   else
      defaultIcons[name] = icon;

   return props => renderIcon(name, props);
}

export function unregisterIcon(...args: string[]): void {
   args.forEach(name => {
      delete icons[name];
      unregisteredDefaultIcons[name] = true;
   });
}

export function renderIcon(name: string | IconRenderer, props: Record<string, any> = {}): React.ReactNode {

   if (isFunction(name))
      return (name as IconRenderer)(props);

   if (icons[name as string])
      return icons[name as string](props);

   if (iconFactory)
      return iconFactory(name as string, props);

   return null;
}

export function clearIcons(): void {
   icons = {};
}

export function registerIconFactory(factory: IconFactory): void {
   iconFactory = factory;
}

export function restoreDefaultIcons(): void {
   icons = {
      ...defaultIcons
   }
}