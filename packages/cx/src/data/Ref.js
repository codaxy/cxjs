import {isFunction} from "../util/isFunction";
import {Component} from "../util/Component";

export class Ref extends Component {
   constructor(config) {
      super(config);
      this.get = ::this.get;
      this.set = ::this.set;
   }

   get() {
      return this.store.get(this.path);
   }

   set(value) {
      return this.store.set(this.path, value);
   }

   init(value) {
      return this.store.init(this.path, value);
   }

   toggle() {
      return this.store.toggle(this.path);
   }

   delete() {
      return this.store.delete(this.path);
   }

   update(...args) {
      return this.store.update(this.path, ...args);
   }

   as(config) {
      return Ref.create(config, {
         store: this.store,
         path: this.path
      });
   }

   //allows the function to be passed as a selector, e.g. to computable or addTrigger
   memoize() {
      return this.get;
   }
}

Ref.factory = function(alias, config, more) {
   if (isFunction(alias)) {
      let cfg = {
         ...config,
         ...more
      };

      if (cfg.store)
         Object.assign(cfg, cfg.store.getMethods());

      let result = alias(cfg);
      if (result instanceof Ref)
         return result;

      return Ref.create({
         ...config,
         ...more,
         ...result
      });
   }

   return Ref.create({
      ...config,
      ...more
   });
};