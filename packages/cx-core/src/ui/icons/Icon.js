const icons = {};

export class Icon {
   static register(name, icon) {
      icons[name] = icon;
      return props => this.render(name, props);
   }

   static render(name, props) {
      if (icons[name])
         return icons[name](props);
      return null;
   }
}
