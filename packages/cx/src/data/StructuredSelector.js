import {Binding} from './Binding';
import {Expression} from './Expression';
import {StringTemplate} from './StringTemplate';
import {createStructuredSelector} from '../data/createStructuredSelector';
import {getSelector} from '../data/getSelector';

function defaultValue(pv) {
   if (typeof pv == 'object' && pv && pv.structured)
      return pv.defaultValue;

   return pv;
}

function getSelectorConfig(props, values, nameMap) {

   let functions = {},
      structures = {},
      defaultValues = {},
      constants, p, v, pv;

   for (p in props) {
      v = values[p];
      pv = props[p];

      if (typeof v == 'undefined' && pv && (pv.bind || pv.tpl || pv.expr))
         v = pv;

      if (v === null) {
         if (!constants)
            constants = {};
         constants[p] = null;
      }
      else if (typeof v == 'object') {
         if (v.bind) {
            if (typeof v.defaultValue == 'undefined' && v != pv)
               v.defaultValue = defaultValue(pv);
            if (typeof v.defaultValue != 'undefined')
               defaultValues[v.bind] = v.defaultValue;
            nameMap[p] = v.bind;
            functions[p] = Binding.get(v.bind).value;
         }
         else if (v.expr)
            functions[p] = Expression.get(v.expr);
         else if (v.tpl)
            functions[p] = StringTemplate.get(v.tpl);
         else if (pv && typeof pv == 'object' && pv.structured) {
            if (Array.isArray(v))
               functions[p] = getSelector(v);
            else
               structures[p] = getSelectorConfig(v, v, {});
         } else {
            if (!constants)
               constants = {};
            constants[p] = v;
         }
      }
      else if (typeof v == 'function') {
         functions[p] = v;
      }
      else {
         if (typeof v == "undefined") {
            if (typeof pv == 'undefined')
               continue;
            v = defaultValue(pv);
         }

         if (typeof v == 'undefined')
            continue;

         if (!constants)
            constants = {};

         constants[p] = v;
      }
   }

   return {
      functions,
      structures,
      defaultValues,
      constants
   };
}

function createSelector({ functions, structures, constants }) {
   let selector = {};

   for (let n in functions) {
      const f = functions[n];
      selector[n] = f.memoize ? f.memoize() : f;
   }

   for (let n in structures)
      selector[n] = createSelector(structures[n]);

   return createStructuredSelector(selector, constants);
}

export class StructuredSelector {

   constructor({props, values}) {
      this.nameMap = {};
      this.config = getSelectorConfig(props, values, this.nameMap);
   }

   init(store) {
      store.init(this.config.defaultValues);
   }

   create() {
      return createSelector(this.config);
   }
}
