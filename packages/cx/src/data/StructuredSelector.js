import {Binding} from './Binding';
import {Expression} from './Expression';
import {StringTemplate} from './StringTemplate';
import {createStructuredSelector} from '../data/createStructuredSelector';
import {getSelector} from '../data/getSelector';
import {isFunction} from '../util/isFunction';
import {isUndefined} from '../util/isUndefined';
import {isDefined} from '../util/isDefined';
import {isArray} from '../util/isArray';

function defaultValue(pv) {
   if (typeof pv == 'object' && pv && pv.structured)
      return pv.defaultValue;

   return pv;
}

function getSelectorConfig(props, values, nameMap) {

   let functions = {},
      structures = {},
      defaultValues = {},
      constants, p, v, pv,
      constant = true;

   for (p in props) {
      v = values[p];
      pv = props[p];

      if (isUndefined(v) && pv && (pv.bind || pv.tpl || pv.expr))
         v = pv;

      if (v === null) {
         if (!constants)
            constants = {};
         constants[p] = null;
      }
      else if (typeof v == 'object') {
         if (v.bind) {
            if (isUndefined(v.defaultValue) && v != pv)
               v.defaultValue = defaultValue(pv);
            if (isDefined(v.defaultValue))
               defaultValues[v.bind] = v.defaultValue;
            nameMap[p] = v.bind;
            functions[p] = Binding.get(v.bind).value;
            constant = false;
         }
         else if (v.expr) {
            functions[p] = Expression.get(v.expr);
            constant = false;
         }
         else if (v.tpl) {
            functions[p] = StringTemplate.get(v.tpl);
            constant = false;
         }
         else if (pv && typeof pv == 'object' && pv.structured) {
            if (isArray(v))
               functions[p] = getSelector(v);
            else
               structures[p] = getSelectorConfig(v, v, {});
            constant = false;
         } 
         else {
            if (!constants)
               constants = {};
            constants[p] = v;
         }
      }
      else if (isFunction(v)) {
         functions[p] = v;
         constant = false;
      }
      else {
         if (isUndefined(v)) {
            if (isUndefined(pv))
               continue;
            v = defaultValue(pv);
         }

         if (isUndefined(v))
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
      constants,
      constant
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

   createStoreSelector() {
      if (this.config.constant) {
         let result = {...this.config.constants};
         return () => result;
      }
      let selector = this.create();
      return store => selector(store.getData());
   }
}
