/** @jsxImportSource react */

import { PureContainer } from "./PureContainer";
import { SubscribableView, SubscribableViewConfig } from "../data/SubscribableView";
import { getSelector } from "../data/getSelector";
import { Cx } from "./Cx";
import { VDOM } from "./Widget";
import { IsolatedScope, IsolatedScopeConfig } from "./IsolatedScope";
import { Instance } from "./Instance";
import { StructuredProp } from "./Prop";

interface ContainmentStoreConfig extends SubscribableViewConfig {
   selector: any;
}

class ContainmentStore extends SubscribableView<any> {
   declare selector: any;
   declare cache: {
      version: number;
      data?: any;
      result?: any;
      itemIndex?: number;
      key?: string;
      parentStoreData?: any;
      containedData?: any;
   };

   constructor(config: ContainmentStoreConfig) {
      super(config);
      this.selector = config.selector;
   }

   getData() {
      return this.store!.getData();
   }

   setItem(path: string, value: any) {
      return this.wrapper(() => {
         this.store!.setItem(path, value);
      });
   }

   deleteItem(path: string) {
      return this.wrapper(() => {
         this.store!.deleteItem(path);
      });
   }

   wrapper(callback: () => void) {
      if (this.store!.silently(callback)) {
         let data = this.getData();
         let containedData = this.selector(data);
         if (containedData === this.cache.containedData) {
            this.store!.notify();
         } else {
            this.cache.containedData = containedData;
            this.notify(undefined!);
         }
         return true;
      }
      return false;
   }
}

export interface DetachedScopeInstance extends Instance {
   subStore: ContainmentStore;
}

export interface DetachedScopeConfig extends IsolatedScopeConfig {
   /**
    * A single binding path or a list of paths to be monitored for changes.
    * Use `exclusive` as a shorthand for defining the `exclusiveData` object.
    */
   exclusive?: string | string[];

   /**
    * Exclusive data selector. If only exclusive data change, the scope will be re-rendered
    * without recalculating other elements on the page.
    * Use in case if the scope uses both exclusive and shared data.
    */
   exclusiveData?: StructuredProp;

   /** Name of the scope used for debugging/reporting purposes. */
   name?: string;

   /** Options passed to the Cx component. */
   options?: any;

   /** Error handler for the detached scope. */
   onError?: (error: Error, instance: Instance, info: any) => void;
}

export class DetachedScope extends IsolatedScope<DetachedScopeConfig, DetachedScopeInstance> {
   declare exclusive?: string | string[];
   declare exclusiveData?: any;
   declare container?: any;
   declare name?: string;
   declare options?: any;
   declare onError?: any;

   declareData(...args: any[]) {
      return super.declareData(...args, {
         exclusiveData: { structured: true },
      });
   }

   init() {
      if (typeof this.exclusive === "string") this.exclusiveData = { bind: this.exclusive };
      if (Array.isArray(this.exclusive)) {
         this.exclusiveData = {};
         this.exclusive.forEach((x, i) => {
            this.exclusiveData[String(i)] = { bind: x };
         });
      }

      this.container = PureContainer.create({
         type: PureContainer,
         items: this.children || this.items,
      });

      delete this.children;
      this.items = [];

      if (this.name)
         this.options = {
            ...this.options,
            name: this.name,
         };

      super.init();
   }

   initInstance(context: any, instance: DetachedScopeInstance) {
      const config: ContainmentStoreConfig = {
         store: instance.parentStore,
         selector: getSelector(this.exclusiveData || this.data),
      };
      instance.subStore = new ContainmentStore(config);
   }

   applyParentStore(instance: any) {
      instance.store = instance.parentStore;
      instance.subStore.setStore(instance.parentStore);
   }

   render(context: any, instance: any, key: string) {
      return (
         <Cx
            key={key}
            widget={this.container}
            store={instance.subStore}
            parentInstance={instance}
            subscribe
            options={this.options}
            onError={this.onError}
         />
      );
   }
}
