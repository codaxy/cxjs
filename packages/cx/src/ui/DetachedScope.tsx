/** @jsxImportSource react */

import { PureContainer } from "./PureContainer";
import { SubscribableView } from "../data/SubscribableView";
import { getSelector } from "../data/getSelector";
import { Cx } from "./Cx";
import { VDOM } from "./Widget";
import { IsolatedScope } from "./IsolatedScope";

export class DetachedScope extends IsolatedScope {
   exclusive?: string | string[];
   exclusiveData?: any;
   container?: any;
   children?: any;
   items?: any;
   name?: string;
   options?: any;
   data?: any;
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

   initInstance(context: any, instance: any) {
      instance.subStore = new ContainmentStore({
         store: instance.store,
         selector: getSelector(this.exclusiveData || this.data),
      });
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

class ContainmentStore extends SubscribableView {
   store: any;
   selector: any;
   cache: any;

   getData() {
      return this.store.getData();
   }

   setItem(...args: any[]) {
      return this.wrapper(() => {
         this.store.setItem(...args);
      });
   }

   deleteItem(...args: any[]) {
      return this.wrapper(() => {
         this.store.deleteItem(...args);
      });
   }

   wrapper(callback: () => void) {
      if (this.store.silently(callback)) {
         let data = this.getData();
         let containedData = this.selector(data);
         if (containedData === this.cache.containedData) {
            this.store.notify();
         } else {
            this.cache.containedData = containedData;
            this.notify();
         }
         return true;
      }
      return false;
   }
}
