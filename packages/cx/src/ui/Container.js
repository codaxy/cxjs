import {contentAppend, Widget} from './Widget';
import {StaticText} from './StaticText';
import {Text} from './Text';
import {innerTextTrim} from '../util/innerTextTrim';
import {isString} from '../util/isString';
import {isArray} from '../util/isArray';
import {exploreChildren} from "./layout/exploreChildren";

export class Container extends Widget {

   init(context) {
      if (typeof this.ws !== 'undefined')
         this.preserveWhitespace = this.ws;

      if (this.preserveWhitespace)
         this.trimWhitespace = false;

      let items = this.items || this.children || [];
      delete this.children;
      this.items = [];

      if (this.layout) {
         let layout = Widget.create({type: this.layout, items});
         layout.init(context);
         this.layout = null;
         if (layout.noLayout) {
            this.useParentLayout = true;
            this.add(items);
         }
         else {
            this.add(layout);
            this.layout = layout;
         }
      }
      else {
         this.add(items);
      }

      super.init(context);
   }

   exploreItems(context, instance, items) {
      instance.children = exploreChildren(context, instance, items, instance.cached.children);
      if (instance.cache('children', instance.children))
         instance.markShouldUpdate(context);
   }

   explore(context, instance) {
      super.explore(context, instance);
      this.exploreItems(context, instance, this.items);
   }

   render(context, instance) {
      return this.renderChildren(context, instance);
   }

   renderChildren(context, instance) {

      let preserveComplexContent = this.useParentLayout;

      function append(result, r) {
         if (r == null)
            return;

         //react element
         if (!r.hasOwnProperty("content")) {
            contentAppend(result, r);
            return;
         }

         if (r.useParentLayout)
            return r.content.forEach(x => append(result, x));

         if (r.atomic || preserveComplexContent) {
            result.push(r);
         }
         else {
            let first = true;
            for (let k in r)
               if (contentAppend(result, r[k], !first))
                  first = false;
         }
      }

      let result = [];
      for (let i = 0; i < instance.children.length; i++) {
         append(result, instance.children[i].vdom);
      }

      if (this.useParentLayout)
         return {
            useParentLayout: true,
            content: result
         };

      return result;
   }

   clear() {
      if (this.layout)
         this.layout.clear();
      else
         this.items = [];
   }

   add(...args) {
      if (this.layout)
         return this.layout.add(...args);

      args.forEach(a => {
         if (!a)
            return;
         if (isArray(a))
            a.forEach(c => this.add(c));
         else if (isString(a)) {
            if (this.trimWhitespace)
               a = innerTextTrim(a);
            if (a)
               this.addText(a);
         } else if (a.isComponent)
            this.items.push(this.wrapItem(a));
         else {
            this.add(Widget.create(a, this.itemDefaults));
         }
      });
   }

   wrapItem(item) {
      return item;
   }

   addText(text) {
      if (this.plainText || text.indexOf('{') == -1 || text.indexOf('}') == -1)
         this.add(Widget.create(StaticText, {text: text}));
      else
         this.add(Widget.create(Text, {text: {tpl: text}}));
   }

   find(filter, options) {

      if (!options)
         options = {};

      if (!filter || !this.items)
         return [];

      let alias = filter;

      if (isString(filter))
         filter = (w) => w.componentAlias == alias;

      if (filter.isComponentType)
         filter = (w) => w instanceof alias;

      let results = [];

      for (let i = 0; i < this.items.length; i++) {
         let w = this.items[i];

         if (!w.initialized)
            w.init();

         if (filter(w)) {
            results.push(w);
            if (options.first)
               break;
         }

         if (w.find)
            results.push(...w.find(filter, options))
      }

      return results;
   }

   findFirst(filter, options) {
      return this.find(filter, {...options, first: true})[0];
   }
}

Container.prototype.trimWhitespace = true;
Container.prototype.plainText = true;
Container.prototype.styled = false;
