import {isFunction} from "../util/isFunction";
import {Component} from "../util/Component";

export class Ref extends Component {
   constructor(config) {
      super(config);
      this.get = ::this.get;
      if (this.set)
         this.set = ::this.set;
   }

   get() {
      throw new Error("Ref's get method is not implemented.");
   }

   init(value) {
      if (this.get() === undefined)
         this.set(value);
   }

   toggle() {
      this.set(!this.get())
   }

   update(cb, ...args) {
      this.set(cb(this.get(), ...args));
   }

   as(config) {
      return Ref.create(config);
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

      return this.create({
         ...config,
         ...more,
         ...result
      });
   }

   return this.create({
      ...config,
      ...more
   });
};