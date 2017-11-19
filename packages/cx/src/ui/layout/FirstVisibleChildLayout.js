import {Layout} from './Layout';
import {isArray} from '../../util/isArray';

export class FirstVisibleChildLayout extends Layout {

   checkVisible(instance) {
      if (!instance.visible)
         return false;

      if (instance.widget.layout && instance.widget.layout.useParentLayout)
         return isArray(instance.children) && instance.children.some(c => this.checkVisible(c));

      return true;
   }

   explore(context, instance, items) {
      instance.children = [];
      for (let i = 0; i < items.length; i++) {
         let x = instance.getChild(context, items[i]);
         if (!x.scheduleExploreIfVisible(context))
            continue;

         let old = instance.cached.children;
         instance.children = old && old[0] === x ? old : [x];
         break;
      }
      if (instance.cache('children', instance.children))
         instance.markShouldUpdate(context);
   }
}

Layout.alias('firstvisiblechild', FirstVisibleChildLayout);