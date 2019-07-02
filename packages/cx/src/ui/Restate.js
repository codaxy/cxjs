import {PureContainer} from "./PureContainer";
import {Store} from '../data/Store';
import {Cx} from './Cx';
import {isString} from "../util/isString";
import {VDOM} from "./VDOM";
import {isFunction} from "../util/isFunction";
import {isObject} from "../util/isObject";
import {isUndefined} from "../util/isUndefined";
import {Binding} from "../data/Binding";
import {StructuredSelector} from "../data/StructuredSelector";

export class Restate extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         deferredUntilIdle: undefined,
         idleTimeout: undefined
      })
   }

   init() {
      this.container = PureContainer.create({
         type: PureContainer,
         items: this.children || this.items,
         layout: this.layout,
         controller: this.controller,
         outerLayout: this.outerLayout,
         useParentLayout: this.useParentLayout,
         ws: this.ws
      });
      this.privateDataSelector = new StructuredSelector({
         props: this.data || {},
         values: this.data
      });
      delete this.items;
      delete this.children;
      delete this.controller;
      delete this.outerLayout;
      delete this.layout;
      this.useParentLayout = true;
      super.init();
   }

   initInstance(context, instance) {
      this.privateDataSelector.init(instance.store);
      instance.subStore = new RestateStore({
         store: instance.store,
         detached: this.detached,
         privateData: this.data || {},
         dataSelector: this.privateDataSelector.create(),
         onSet: (path, value) => {
            let config = this.data[path];
            if (!config || (!config.bind && !config.set))
               throw new Error(`Cannot change ${path} in Restate as it's read-only. It's not a binding and it doesn't have a set function either.`);

            if (config.bind)
               return isUndefined(value) ? instance.store.deleteItem(config.bind) : instance.store.setItem(config.bind, value);

            if (isString(config.set))
               instance.getControllerMethod(config.set)(value, instance);
            else if (isFunction(config.set))
               config.set(value, instance);
            else
               throw new Error(`Cannot set value for ${path} in Restate as the setter is neither a function or a controller method.`);

            return true;
         }
      });

      instance.setStore = store => {
         instance.store = store;
         instance.subStore.setStore(store);
      };
   }

   explore(context, instance) {
      if (instance.subStore.parentDataCheck())
         instance.markShouldUpdate();
      if (!this.detached) {
         instance.container = instance.getChild(context, this.container, "container", instance.subStore);
         instance.container.scheduleExploreIfVisible(context);
      }
      super.explore(context, instance);
   }

   render(context, instance, key) {
      if (!this.detached)
         return instance.container.render(context);

      return <Cx
         key={key}
         widget={this.container}
         parentInstance={instance}
         store={instance.subStore}
         subscribe
         options={this.options}
         onError={this.onError}
         deferredUntilIdle={instance.data.deferredUntilIdle}
         idleTimeout={instance.data.idleTimeout}
      />
   }
}

Restate.prototype.detached = false;
Restate.prototype.waitForIdle = false;

class RestateStore extends Store {

   constructor(config) {
      super(config);
      this.parentDataVersion = -1;
      this.parentDataCheck();
   }

   parentDataCheck() {
      if (this.parentDataVersion == this.store.meta.version)
         return false;
      this.parentDataVersion = this.store.meta.version;
      this.parentData = this.dataSelector(this.store.getData());
      return this.batch(() => {
         for (let key in this.parentData) {
            super.setItem(key, this.parentData[key]);
         }
      });
   }

   setItem(path, value) {
      let binding = Binding.get(path);
      let bindingRoot = binding.parts[0];
      if (!isObject(this.privateData) || !this.privateData.hasOwnProperty(bindingRoot)) {
         let changed = isUndefined(value)
            ? super.deleteItem(path)
            : super.setItem(path, value);
         return changed;
      }
      let newValue = value;
      if (binding.parts.length > 1)
         newValue = binding.set(this.getData(), value)[bindingRoot];
      this.onSet(bindingRoot, newValue);
      this.batch(() => {
         super.setItem(bindingRoot, newValue);
         this.parentDataCheck();
      });
      return true;
   }

   deleteItem(path) {
      return this.setItem(path, undefined);
   }

   doNotify() {
      if (!this.detached)
         this.store.notify();
      super.doNotify();
   }
}

export class PrivateStore extends Restate {};
