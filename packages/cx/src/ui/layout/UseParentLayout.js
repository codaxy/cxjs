import {Layout} from './Layout';

export class UseParentLayout extends Layout {
   render(context, instance, keyPrefix) {
      var result = [];
      instance.children.forEach(c => {
         var r = c.render(context);
         if (c.widget.layout && c.widget.layout.useParentLayout && Array.isArray(r.content)) {
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