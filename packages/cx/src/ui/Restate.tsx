/** @jsxImportSource react */
import { PureContainer, PureContainerConfig } from "./PureContainer";
import { Store } from "../data/Store";
import { View } from "../data/View";
import { Cx } from "./Cx";
import { VDOM } from "./VDOM";
import { isObject } from "../util/isObject";
import { isUndefined } from "../util/isUndefined";
import { Binding } from "../data/Binding";
import { StructuredSelector } from "../data/StructuredSelector";
import { getCurrentCulture, CultureInfo } from "./Culture";
import { BooleanProp, NumberProp, StringProp, StructuredProp } from "./Prop";
import { Instance } from "./Instance";

let persistenceCache: any = {};

export interface RestateConfig extends PureContainerConfig {
   data?: StructuredProp;
   detached?: boolean;
   deferredUntilIdle?: BooleanProp;
   idleTimeout?: NumberProp;
   cacheKey?: StringProp;
   immediate?: boolean;
   onError?: (error: Error, instance: Instance) => void;
   culture?: CultureInfo;
}

// Legacy alias for backward compatibility
export interface RestateProps extends RestateConfig {}

export class Restate<Config extends RestateConfig = RestateConfig> extends PureContainer<Config> {
   container: any;
   privateDataSelector: any;
   detached: boolean;
   data?: any;
   // children, items, layout, controller, outerLayout, useParentLayout, ws inherited from parent classes
   culture?: any;
   options?: any;
   onError?: any;
   waitForIdle: boolean;
   immediate: boolean;

   declareData(...args: any[]) {
      return super.declareData(...args, {
         deferredUntilIdle: undefined,
         idleTimeout: undefined,
         cacheKey: undefined,
      });
   }

   init() {
      this.container = PureContainer.create({         
         items: this.children || this.items,
         layout: this.layout,
         controller: this.controller,
         outerLayout: this.outerLayout,
         useParentLayout: !this.detached,
         ws: this.ws,
      });
      this.privateDataSelector = new StructuredSelector({
         props: this.data || {},
         values: this.data,
      });
      delete this.items;
      delete this.children;
      delete this.controller;
      delete this.outerLayout;
      delete this.layout;
      if (this.useParentLayout == null) this.useParentLayout = !this.detached;
      super.init();
   }

   initSubStore(context: any, instance: any) {
      let { cacheKey } = instance.data;
      this.privateDataSelector.init(instance.store);
      instance.subStore = new RestateStore({
         store: instance.store,
         detached: this.detached,
         privateData: this.data || {},
         data: cacheKey ? persistenceCache[cacheKey] || {} : {},
         dataSelector: this.privateDataSelector.create(),
         onSet: (path: string, value: any) => instance.nestedDataSet(path, value, this.data),
      });

      if (cacheKey) {
         instance.subscribeOnDestroy(() => {
            persistenceCache[cacheKey] = instance.subStore.getData();
         });
      }
   }

   applyParentStore(instance: any) {
      if (instance.subStore) instance.subStore.setStore(instance.parentStore);
   }

   explore(context: any, instance: any) {
      if (!instance.subStore) this.initSubStore(context, instance);
      if (instance.subStore.parentDataCheck()) instance.markShouldUpdate();
      instance.cultureInfo = this.culture ?? getCurrentCulture();
      if (instance.cache("cultureInfo", instance.culture)) instance.markShouldUpdate();
      super.explore(context, instance);
   }

   exploreItems(context: any, instance: any, items: any) {
      if (!this.detached) {
         instance.container = instance.getChild(context, this.container, "container", instance.subStore);
         instance.container.scheduleExploreIfVisible(context);
         instance.children = [instance.container];
      }
   }

   render(context: any, instance: any, key: string) {
      if (!this.detached) return instance.container.render(context);

      return (
         <Cx
            key={key}
            widget={this.container}
            parentInstance={instance}
            store={instance.subStore}
            subscribe
            options={this.options}
            onError={this.onError}
            deferredUntilIdle={instance.data.deferredUntilIdle}
            idleTimeout={instance.data.idleTimeout}
            immediate={this.immediate}
            cultureInfo={instance.cultureInfo}
         />
      );
   }
}

Restate.prototype.detached = false;
Restate.prototype.waitForIdle = false;
Restate.prototype.immediate = false;
Restate.prototype.culture = null;

export const PrivateStore = Restate;

class RestateStore extends Store {
   parentDataVersion: number;
   parentData: any;
   dataSelector: any;
   privateData: any;
   onSet: any;
   detached: any;
   // @ts-expect-error - RestateStore needs its own store property to reference the parent store
   store: View; // Parent store reference

   constructor(config: any) {
      super(config);
      this.parentDataVersion = -1;
   }

   getData() {
      this.silently(() => {
         this.parentDataCheck();
      });
      return super.getData();
   }

   parentDataCheck() {
      if (this.parentDataVersion == this.store.meta.version) return false;
      this.parentDataVersion = this.store.meta.version;
      this.parentData = this.dataSelector(this.store.getData());
      return this.batch(() => {
         for (let key in this.parentData) {
            super.setItem(key, this.parentData[key]);
         }
      });
   }

   setItem(path: string, value: any) {
      let binding = Binding.get(path);
      let bindingRoot = binding.parts[0];
      if (!isObject(this.privateData) || !this.privateData.hasOwnProperty(bindingRoot)) {
         let changed = isUndefined(value) ? super.deleteItem(path) : super.setItem(path, value);
         return changed;
      }

      let newValue = value;
      if (binding.parts.length > 1) newValue = binding.set(this.getData(), value)[bindingRoot];
      this.onSet(bindingRoot, newValue);
      this.batch(() => {
         super.setItem(bindingRoot, newValue);
         this.parentDataCheck();
      });
      return true;
   }

   deleteItem(path: string) {
      return this.setItem(path, undefined);
   }

   doNotify() {
      if (!this.detached) this.store.notify(undefined!);
      super.doNotify(undefined!);
   }

   // override the default implementation to avoid meta overwrites
   setStore(store: any) {
      this.store = store;
   }
}
