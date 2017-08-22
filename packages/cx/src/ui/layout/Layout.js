import {Component} from '../Component';
import {contentAppend} from '../Widget';
import {CSSHelper} from '../CSSHelper';
import {exploreChildren} from './exploreChildren';
import {isString} from '../../util/isString';
import {isArray} from '../../util/isArray';

export class Layout extends Component {
   
   init() {
      super.init();
      if (isString(this.CSS))
         this.CSS = CSSHelper.get(this.CSS);
   }

   explore(context, instance, items) {
      let children = exploreChildren(context, instance, items, instance.cached.children);
      if (instance.children != children) {
         instance.shouldUpdate = true;
         instance.children = children;
      }
   }
   
   prepare(context, instance) {
      for (let i = 0; i<instance.children.length; i++) {
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
         if (child.widget.layout && child.widget.layout.useParentLayout && isArray(r.content)) {
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
