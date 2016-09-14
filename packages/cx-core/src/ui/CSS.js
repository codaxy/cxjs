import {CSSHelper} from './CSSHelper';
import {parseStyle} from '../util/parseStyle';

export class CSS {

   static resolve() {
      var list = [];
      for (var i = 0; i < arguments.length; i++) {
         var arg = arguments[i];
         if (arg) {
            var type = typeof arg;
            if (type == 'string')
               list.push(arg);
            else if (type == 'object') {
               if (Array.isArray(arg))
                  list.push(...this.resolve(...arg));
               else
                  for (var key in arg)
                     if (arg[key])
                        list.push(key);
            }
         }
      }
      return list;
   }

   static block(baseClass, styleModifiers, stateModifiers) {
      var list = [];
      if (baseClass)
         list.push(this.classPrefix + 'b-' + baseClass);
      list.push(...this.resolve(styleModifiers).map(m=>this.classPrefix + 'm-' + m));
      list.push(...this.resolve(stateModifiers).map(m=>this.classPrefix + 's-' + m));
      return list.join(' ') || null;
   }

   static element(baseClass, elementClass, stateModifiers) {
      if (!baseClass || !elementClass)
         return;

      return [
            this.classPrefix + 'e-' + baseClass + '-' + elementClass,
            ...this.resolve(stateModifiers).map(m=>this.classPrefix + 's-' + m)
         ].join(' ') || null;
   }

   static state(stateModifiers) {
      return [
            ...this.resolve(stateModifiers).map(m=>this.classPrefix + 's-' + m)
         ].join(' ') || null;
   }

   static expand() {
      return this.resolve(...arguments).join(' ') || null;
   }

   static parseStyle(str) {
      return parseStyle(str);
   }
}

CSS.classPrefix = "cx";

CSSHelper.alias('cx', CSS);
