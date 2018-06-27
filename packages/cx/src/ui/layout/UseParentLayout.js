import {Layout} from './Layout';
import {isArray} from '../../util/isArray';

export class UseParentLayout extends Layout {
   render(context, instance, keyPrefix) {
      var result = [];
      instance.children.forEach(c => {
         var r = c.vdom;
         if (c.widget.layout && c.widget.layout.useParentLayout && isArray(r.content)) {
            r.content.forEach(r=> {
               result.push(r);
            })
         }
         else
            result.push(r);
      });
      return result;
   }
}

UseParentLayout.prototype.useParentLayout = true;

Layout.alias('parent', UseParentLayout);