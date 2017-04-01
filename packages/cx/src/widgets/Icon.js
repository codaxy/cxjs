import { Widget, VDOM } from '../ui/Widget';

let icons = {};
let iconFactory = null;

let unregisteredDefaultIcons = {};

export class Icon extends Widget {
   declareData() {
      super.declareData(...arguments, {
         name: undefined,
         className: {structured: true},
         class: {structured: true},
         style: {structured: true},
      })
   }

   render(context, instance, key) {
      let {data} = instance;
      return Icon.render(data.name, {
         key: key,
         className: data.classNames,
         style: data.style
      });
   }

   static register(name, icon, defaultIcon = false) {
      if (!defaultIcon || !unregisteredDefaultIcons[name])
         icons[name] = icon;

      if (!defaultIcon)
         unregisteredDefaultIcons[name] = true;

      return props => this.render(name, props);
   }

   static unregister(...args) {
      args.forEach(name => {
         delete icons[name];
         unregisteredDefaultIcons[name] = true;
      });
   }

   static render(name, props) {

      if (typeof name == 'function')
         return name(props);

      if (icons[name])
         return icons[name](props);

      if (iconFactory)
         return iconFactory(name, props);

      return null;
   }

   static clear() {
      icons = {};
   }

   static registerFactory(factory) {
      iconFactory = factory;
   }
}

Icon.prototype.baseClass = "icon";

Widget.alias('icon', Icon);
