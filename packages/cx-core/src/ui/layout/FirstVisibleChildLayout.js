import {Layout} from './Layout';

export class FirstVisibleChildLayout extends Layout {

   explore(context, instance, items) {
      instance.children = [];
      var identical = !instance.shouldUpdate && instance.cached.children != null;
      for (var i = 0; i < items.length; i++) {
         let x = instance.getChild(context, items[i]);
         x.explore(context);
         if (x.visible) {
            if (identical && instance.cached.children[instance.children.length] !== x)
               identical = false;
            instance.children.push(x);
            break;
         }
      }

      if (!identical || instance.children.length != instance.cached.children.length)
         instance.shouldUpdate = true;
   }
}

Layout.alias('firstvisiblechild', FirstVisibleChildLayout);