import {Component} from '../../Component';
import {contentAppend} from '../Widget';
import {CSSHelper} from '../CSSHelper';


export class Layout extends Component {
   
   init() {
      super.init();
      if (typeof this.CSS == 'string')
         this.CSS = CSSHelper.get(this.CSS);
   }

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
         }
      }

      if (!identical || instance.children.length != instance.cached.children.length)
         instance.shouldUpdate = true;
   }
   
   prepare(context, instance) {
      for (var i = 0; i<instance.children.length; i++) {
         instance.children[i].prepare(context);
      }
   }

   append(result, r) {
      if (r != null) {
         if (typeof r == 'object') {
            if (r.atomic)
               result.push(r);
            else {
               var first = true;
               for (var k in r)
                  if (contentAppend(result, r[k], !first))
                     first = false;
            }
         }
         else
            contentAppend(result, r);
      }
   }

   render(context, instance, keyPrefix) {
      var result = [],
         child, r;
      for (var i = 0; i < instance.children.length; i++) {
         child = instance.children[i];
         r = child.render(context, keyPrefix);
         if (child.widget.layout && child.widget.layout.useParentLayout && Array.isArray(r.content)) {
            r.content.forEach(r=>this.append(result, r));
         }
         else
            this.append(result, r);
      }
      return result;
   }

   cleanup(context, instance) {
      for (var i = 0; i<instance.children.length; i++) {
         instance.children[i].cleanup(context);
      }
      instance.cached.children = instance.children;
   }
}

Layout.prototype.CSS = 'cx';

Layout.namespace = 'ui.layout.';

Layout.alias('default', Layout);
