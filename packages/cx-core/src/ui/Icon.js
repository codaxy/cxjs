let icons = {};
let iconFactory = null;

export class Icon {
   static register(name, icon) {
      icons[name] = icon;
      return props => this.render(name, props);
   }

   static unregister(...args) {
      args.forEach(name => {
         delete icons[name];
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
