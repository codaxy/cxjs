import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import {
   registerIcon,
   registerIconFactory,
   clearIcons,
   unregisterIcon,
   renderIcon,
   restoreDefaultIcons,
} from "./icons/registry";
import "./icons/index";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import { StringProp, ClassProp, StyleProp } from "../ui/Prop";

export interface IconConfig extends WidgetConfig {
   /** Name under which the icon is registered. */
   name?: StringProp;

   /** Additional CSS classes to be applied to the field.
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. */
   className?: ClassProp;

   /** Additional CSS classes to be applied to the field.
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. */
   class?: ClassProp;

   /** Style object applied to the wrapper div. Used for setting the dimensions of the field. */
   style?: StyleProp;

   /** Base CSS class to be applied to the element. Default is `icon`. */
   baseClass?: string;
}

export class Icon extends Widget<IconConfig> {
   declareData(...args: Record<string, unknown>[]): void {
      super.declareData(...args, {
         name: undefined,
      });
   }

   render(context: RenderingContext, instance: Instance, key: string): React.ReactNode {
      let { data } = instance;
      return renderIcon(data.name, {
         key: key,
         className: data.classNames,
         style: data.style,
      });
   }

   static register(name: string, icon: any, defaultIcon: boolean = false) {
      return registerIcon(name, icon, defaultIcon);
   }

   static unregister(...args: string[]) {
      return unregisterIcon(...args);
   }

   static render(name: string, props: Record<string, any>): React.ReactNode {
      return renderIcon(name, props);
   }

   static clear() {
      return clearIcons();
   }

   static registerFactory(factory: (name: string, props: Record<string, any>) => any) {
      return registerIconFactory(factory);
   }

   static restoreDefaultIcons() {
      restoreDefaultIcons();
   }
}

Icon.prototype.baseClass = "icon";
Icon.prototype.styled = true;

Widget.alias('icon', Icon);
