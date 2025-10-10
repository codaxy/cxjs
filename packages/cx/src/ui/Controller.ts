import { computable } from "../data/computable";
import { Component } from "../util/Component";
import { isArray } from "../util/isArray";
import { isFunction } from "../util/isFunction";
import { StoreProxy } from "../data/StoreProxy";

const computablePrefix = "computable-";
const triggerPrefix = "trigger-";

interface ComputableEntry {
   name: string;
   selector: any;
   type: "computable" | "trigger";
}

export class Controller extends Component {
   initialized?: boolean;
   onInit?: (context: any) => void;
   onExplore?: (context: any) => void;
   onPrepare?: (context: any) => void;
   onCleanup?: (context: any) => void;
   instance: any;
   store: any;
   computables?: Record<string, ComputableEntry>;

   init(context: any) {
      if (!this.initialized) {
         this.initialized = true;
         if (this.onInit) this.onInit(context);
      }
   }

   explore(context: any) {
      let { store } = this.instance;
      this.store = store; //in rare cases instance may change its store

      if (!this.initialized) {
         this.init(context);
         //forgive if the developer forgets to call super.init()
         this.initialized = true;
      }

      if (this.computables) {
         for (let key in this.computables) {
            let x = this.computables[key];
            let v = x.selector(store.getData());
            if (x.type == "computable") store.set(x.name, v);
         }
      }

      if (this.onExplore) {
         this.onExplore(context);
      }
   }

   prepare(context: any) {
      if (this.onPrepare) {
         this.onPrepare(context);
      }
   }

   cleanup(context: any) {
      if (this.onCleanup) {
         this.onCleanup(context);
      }
   }

   addComputable(name: string, args: any[], callback: (...args: any[]) => any) {
      if (!isArray(args)) throw new Error("Second argument to the addComputable method should be an array.");
      let selector = computable(...args, callback).memoize();
      if (!this.computables) this.computables = {};
      this.computables[computablePrefix + name] = { name, selector, type: "computable" };
   }

   addTrigger(name: string, args: any[], callback: (...args: any[]) => any, autoRun?: boolean) {
      if (!isArray(args)) throw new Error("Second argument to the addTrigger method should be an array.");
      let selector = computable(...args, callback).memoize(!autoRun && this.store.getData());
      if (!this.computables) this.computables = {};
      this.computables[triggerPrefix + name] = { name, selector, type: "trigger" };
   }

   removeTrigger(name: string) {
      if (this.computables) delete this.computables[triggerPrefix + name];
   }

   removeComputable(name: string) {
      if (this.computables) delete this.computables[computablePrefix + name];
   }

   invokeParentMethod(methodName: string, ...args: any[]) {
      let parent = this.instance.parent;
      return parent.invokeControllerMethod(methodName, ...args);
   }

   invokeMethod(methodName: string, ...args: any[]) {
      return this.instance.invokeControllerMethod(methodName, ...args);
   }
}

Controller.namespace = "ui.controller.";

Controller.factory = function (alias: any, config?: any, more?: any) {
   if (isFunction(alias)) {
      let cfg = {
         ...config,
         ...more,
      };

      if (cfg.instance) {
         //in rare cases instance.store may change, so we cannot rely on the store passed through configuration
         cfg.store = new StoreProxy(() => cfg.instance.store);
         Object.assign(cfg, cfg.store.getMethods());
      }

      let result = alias(cfg);
      if (result instanceof Controller) return result;

      return Controller.create({
         ...config,
         ...more,
         ...result,
      });
   }

   return Controller.create({
      ...config,
      ...more,
   });
};
