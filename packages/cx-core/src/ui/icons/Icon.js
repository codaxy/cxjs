const icons = {};

export class Icon {
   static register(name, icon) {
      icons[name] = icon;
      return props => this.render(name, props);
   }

   static render(name, props) {
      return icons[name](props);
   }
}
