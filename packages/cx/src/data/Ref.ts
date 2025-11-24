import { isFunction } from "../util/isFunction";
import { Component } from "../util/Component";
import { Binding } from "./Binding";
import { View } from "./View";
import { CanMemoize } from "./Selector";

interface RefConfig<T> {
   store?: View;
   path?: string;
   get?: () => T;
   set?: (value: T) => boolean;
}

export class Ref<T = any> extends Component implements CanMemoize<T> {
   declare isRef?: boolean;

   constructor(config: RefConfig<T>) {
      super(config);
      this.get = this.get.bind(this);
      if (this.set) this.set = this.set.bind(this);
   }

   get(): T {
      throw new Error("Ref's get method is not implemented.");
   }

   set(value: T): boolean {
      throw new Error("Ref's set method is not implemented.");
   }

   delete(): boolean {
      throw new Error("Ref's delete method is not implemented.");
   }

   // Component.init() override - no-op for compatibility
   init(): void;
   // Initialize ref value if it's currently undefined
   init(value: T): boolean;
   init(value?: T): boolean | void {
      if (value === undefined) return; // Component.init() compatibility
      if (this.get() === undefined) return this.set(value);
      return false;
   }

   toggle(): boolean {
      return this.set(!this.get() as T);
   }

   update(cb: (currentValue: T, ...args: any[]) => T, ...args: any[]): boolean {
      return this.set(cb(this.get(), ...args));
   }

   as(config: any): Ref {
      return Ref.create(config, {
         get: this.get,
         set: this.set,
      });
   }

   ref<ST = any>(path: string): Ref<ST> {
      let binding = Binding.get(path);
      return Ref.create({
         get: () => binding.value(this.get()),
         set: (value: any) => {
            let data = this.get();
            let newData = binding.set(data as Record<string, any>, value);
            if (data === newData) return false;
            return this.set(newData as T);
         },
      });
   }

   //allows the function to be passed as a selector, e.g. to computable or addTrigger
   memoize(): () => T {
      return this.get;
   }
}

Ref.prototype.isRef = true;

Ref.factory = function (alias: any, config?: any, more?: any): Ref {
   if (isFunction(alias)) {
      let cfg = {
         ...config,
         ...more,
      };

      if (cfg.store) Object.assign(cfg, cfg.store.getMethods());

      let result = alias(cfg);
      if (result instanceof Ref) return result;

      return this.create({
         ...config,
         ...more,
         ...result,
      });
   }

   return this.create({
      ...config,
      ...more,
   });
};
