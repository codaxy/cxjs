/** @jsxImportSource react */

import { PureContainer } from "./PureContainer";
import { SubscribableView } from "../data/SubscribableView";
import { getSelector } from "../data/getSelector";
import { Cx } from "./Cx";
import { VDOM } from "./Widget";
import { IsolatedScope } from "./IsolatedScope";
import { Instance } from "./Instance";
import { SubscribableViewConfig } from "../data/SubscribableView";

interface ContainmentStoreConfig extends SubscribableViewConfig {
   selector: any;
}

class ContainmentStore extends SubscribableView<any> {
   selector: any;
   declare cache: { version: number; data?: any; result?: any; itemIndex?: number; key?: string; parentStoreData?: any; containedData?: any };

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

export class DetachedScope extends IsolatedScope<any, DetachedScopeInstance> {
   exclusive?: string | string[];
   exclusiveData?: any;
   container?: any;
   name?: string;
   options?: any;
   onError?: any;

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
      delete this.items;
      delete this.children;

      if (this.name)
         this.options = {
            ...this.options,
            name: this.name,
         };

      super.init();
   }

   initInstance(context: any, instance: DetachedScopeInstance) {
      const config: ContainmentStoreConfig = {
         store: instance.store,
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
