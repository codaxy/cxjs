var bindingCache = {};
import {isString} from '../util/isString';

export class Binding {

   constructor(path) {
      this.path = path;
      this.parts = path.split('.');
      var fstr = 'return (x';
      var cpath = 'x';

      for (var i = 0; i < this.parts.length; i++) {
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
      var cv = this.value(state);
      if (cv === value)
         return state;

      var ns = Object.assign({}, state);
      var o = ns;

      for (let i = 0; i < this.parts.length; i++) {
         var part = this.parts[i];
         let no = (i == this.parts.length - 1) ? value : Object.assign({}, o[part]);
         o[part] = no;
         o = no;
      }

      return ns;
   }

   delete(state) {
      var ns = Object.assign({}, state);
      var o = ns;
      var part;

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
      return path; //if binding instance is provided return it
   }
}
