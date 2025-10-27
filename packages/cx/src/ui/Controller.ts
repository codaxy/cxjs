import { computable, ComputableSelector, InferSelectorValue } from "../data/computable";
import { Component } from "../util/Component";
import { isArray } from "../util/isArray";
import { isFunction } from "../util/isFunction";
import { StoreProxy } from "../data/StoreProxy";
import { RenderingContext } from "./RenderingContext";
import { View } from "src/data";
import { Widget } from "./Widget";
import { Instance } from "./Instance";

const computablePrefix = "computable-";
const triggerPrefix = "trigger-";

interface ComputableEntry {
   name: string;
   selector: any;
   type: "computable" | "trigger";
}

export class Controller extends Component {
   initialized?: boolean;
   onInit?(context: RenderingContext): void;
   onExplore?(context: RenderingContext): void;
   onPrepare?(context: RenderingContext): void;
   onCleanup?(context: RenderingContext): void;
   onDestroy?(): void;
   instance: Instance;
   store: View;
   widget?: Widget;
   computables?: Record<string, ComputableEntry>;

   init(context?: RenderingContext): void {
      if (!this.initialized) {
         this.initialized = true;
         if (this.onInit && context) this.onInit(context);
      }
   }

   explore(context: RenderingContext): void {
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

   prepare(context: RenderingContext): void {
      if (this.onPrepare) {
         this.onPrepare(context);
      }
   }

   cleanup(context: RenderingContext): void {
      if (this.onCleanup) {
         this.onCleanup(context);
      }
   }

   addComputable<Selectors extends readonly ComputableSelector[]>(
      name: string,
      args: [...Selectors],
      callback: (...values: { [K in keyof Selectors]: InferSelectorValue<Selectors[K]> }) => any
   ): void {
      if (!isArray(args)) throw new Error("Second argument to the addComputable method should be an array.");
      let selector = computable(...args, callback).memoize();
      if (!this.computables) this.computables = {};
      this.computables[computablePrefix + name] = { name, selector, type: "computable" };
   }

   addTrigger<Selectors extends readonly ComputableSelector[]>(
      name: string,
      args: [...Selectors],
      callback: (...values: { [K in keyof Selectors]: InferSelectorValue<Selectors[K]> }) => any,
      autoRun?: boolean
   ): void {
      if (!isArray(args)) throw new Error("Second argument to the addTrigger method should be an array.");
      let selector = computable(...args, callback).memoize(!autoRun && this.store.getData());
      if (!this.computables) this.computables = {};
      this.computables[triggerPrefix + name] = { name, selector, type: "trigger" };
   }

   removeTrigger(name: string): void {
      if (this.computables) delete this.computables[triggerPrefix + name];
   }

   removeComputable(name: string): void {
      if (this.computables) delete this.computables[computablePrefix + name];
   }

   invokeParentMethod(methodName: string, ...args: any[]): any {
      let parent = this.instance.parent;
      if (!parent) throw new Error("Cannot invoke a parent controller method as the instance does not have a parent.");
      return parent.invokeControllerMethod(methodName, ...args);
   }

   invokeMethod(methodName: string, ...args: any[]): any {
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
