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

   var config = {
      bindings: {},
      templates: {},
      expressions: {},
      functions: {},
      structures: {}
   };

   for (var p in props) {
      let v = values[p];
      let pv = props[p];

      if (typeof v == 'undefined' && pv && (pv.bind || pv.tpl || pv.expr))
         v = pv;

      if (v === null)
         config.functions[p] = () => null;
      else if (typeof v == 'object') {
         if (v.bind) {
            config.bindings[p] = v;
            if (typeof v.defaultValue == 'undefined' && v != pv)
               v.defaultValue = defaultValue(pv);
            nameMap[p] = v.bind;
         } else if (v.expr) {
            config.expressions[p] = v.expr;
         } else if (v.tpl) {
            config.templates[p] = v.tpl;
         } else if (pv && typeof pv == 'object' && pv.structured) {
            if (Array.isArray(v))
               config.functions[p] = getSelector(v);
            else
               config.structures[p] = getSelectorConfig(v, v, {});
         } else {
            config.functions[p] = () => v;
         }
      }
      else if (typeof v == 'function') {
         config.functions[p] = v;
      }
      else {
         if (typeof v == "undefined") {
            if (typeof pv == 'undefined')
               continue;
            v = defaultValue(pv);
         }

         config.functions[p] = () => v;
      }
   }

   return config;
}

function createSelector(config) {
   var selector = {};

   for (let n in config.bindings) {
      var bv = config.bindings[n];
      var b = Binding.get(bv.bind);
      selector[n] = b.value;
   }

   for (let n in config.templates) {
      const tpl = config.templates[n];
      selector[n] = StringTemplate.compile(tpl); //new memoization instance
   }

   for (let n in config.expressions) {
      const expr = config.expressions[n];
      selector[n] = Expression.compile(expr); //new memoization instance
   }

   for (let n in config.functions) {
      const f = config.functions[n];
      selector[n] = f.memoize ? f.memoize() : f;
   }

   for (let n in config.structures)
      selector[n] = createSelector(config.structures[n]);

   var objectGetter = createStructuredSelector(selector);

   // objectGetter.peek = function (field, data) {
   //    return selector[field](data);
   // };

   return objectGetter;
}

export class StructuredSelector {

   constructor({props, values}) {
      this.nameMap = {};
      this.config = getSelectorConfig(props, values, this.nameMap);
   }

   init(store) {
      for (let n in this.config.bindings) {
         var bv = this.config.bindings[n];
         if (typeof bv.defaultValue != 'undefined')
            store.init(bv.bind, bv.defaultValue);
      }
   }

   create() {
      return createSelector(this.config);
   }
}
