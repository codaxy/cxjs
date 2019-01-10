import { Widget, VDOM } from '../ui/Widget';
import { registerIcon, registerIconFactory, clearIcons, unregisterIcon, renderIcon, restoreDefaultIcons } from './icons/registry';
import "./icons/index";


export class Icon extends Widget {
   declareData() {
      super.declareData(...arguments, {
         name: undefined
      })
   }

   render(context, instance, key) {
      let {data} = instance;
      return renderIcon(data.name, {
         key: key,
         className: data.classNames,
         style: data.style
      });
   }

   static register(name, icon, defaultIcon = false) {
      return registerIcon(name, icon, defaultIcon);
   }

   static unregister(...args) {
      return unregisterIcon(...args);
   }

   static render(name, props) {
      return renderIcon(name, props);
   }

   static clear() {
      return clearIcons();
   }

   static registerFactory(factory) {
      return registerIconFactory(factory);
   }

   static restoreDefaultIcons() {
      restoreDefaultIcons();
   }
}

Icon.prototype.baseClass = "icon";
Icon.prototype.styled = true;

Widget.alias('icon', Icon);
