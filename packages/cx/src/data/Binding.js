let bindingCache = {};
import {isString} from '../util/isString';
import {isObject} from '../util/isObject';

export class Binding {

   constructor(path) {
      this.path = path;
      this.parts = path.split('.');
      let fstr = 'return (x';
      let cpath = 'x';

      for (let i = 0; i < this.parts.length; i++) {
         if (this.parts[i][0] >= '0' && this.parts[i][0] <= '9')
            cpath += '[' + this.parts[i] + ']';
         else
            cpath += '.' + this.parts[i];

         if (i + 1 < this.parts.length)
            fstr += ' && ' + cpath;
         else
            fstr += ' ? ' + cpath + ' : undefined';
      }

      fstr += ')';
      this.value = new Function('x', fstr);
   }

   set(state, value) {
      let cv = this.value(state);
      if (cv === value)
         return state;

      let ns = Object.assign({}, state);
      let o = ns;

      for (let i = 0; i < this.parts.length; i++) {
         let part = this.parts[i];
         let no = (i == this.parts.length - 1) ? value : Object.assign({}, o[part]);
         o[part] = no;
         o = no;
      }

      return ns;
   }

   delete(state) {
      let ns = Object.assign({}, state);
      let o = ns;
      let part;

      for (let i = 0; i < this.parts.length - 1; i++) {
         part = this.parts[i];
         let no = Object.assign({}, o[part]);
         o[part] = no;
         o = no;
      }

      part = this.parts[this.parts.length - 1];
      if (!o.hasOwnProperty(part))
         return state;

      delete o[part];

      return ns;
   }

   static get(path) {
      if (isString(path)) {
         let b = bindingCache[path];
         if (b)
            return b;

         b = new Binding(path);
         bindingCache[path] = b;
         return b;
      }

      if (isObject(path) && isString(path.bind))
         return this.get(path.bind);

      if (path instanceof Binding)
         return path;

      throw new Error('Invalid binding definition provided.');
   }
}


export function isBinding(value) {
   if (isObject(value) && isString(value.bind))
      return true;
   return value instanceof Binding;
}
