import {PureContainer} from "./PureContainer";
import {isString} from "../util/isString";
import {isObject} from "../util/isObject";
import {isFunction} from "../util/isFunction";
import {isUndefined} from "../util/isUndefined";
import {ReadOnlyDataView} from "../data/ReadOnlyDataView";
import {UseParentLayout} from "../ui/layout/UseParentLayout";
import {getSelector} from "../data/getSelector";
import {Binding} from "../data/Binding";


export class DataProxy extends PureContainer {

   init() {
      if (!this.data)
         this.data = {};

      if (this.alias)
         this.data[this.alias] = this.value;

      this.container = PureContainer.create({
         type: PureContainer,
         items: this.children || this.items,
         layout: this.layout,
         controller: this.controller,
         outerLayout: this.outerLayout,
         ws: this.ws
      });
      this.children = [this.container];
      delete this.items;
      delete this.controller;
      delete this.outerLayout;
      this.layout = UseParentLayout;
      super.init();
   }

   initInstance(context, instance) {
      instance.store = new DataProxyView({
         store: instance.store,
         privateData: this.data,
         onSet: (path, value) => {
            let config = this.data[path];
            if (config.bind)
               return isUndefined(value) ? instance.store.deleteItem(config.bind) : instance.store.setItem(config.bind, value);

            if (!config.set)
               throw new Error(`Cannot set value for ${path} in DataProxy as the setter is not defined.`);

            if (isString(config.set))
               instance.getControllerMethod(config.set)(value, instance);
            else if (isFunction(config.set))
               config.set(value, instance);
            else
               throw new Error(`Cannot set value for ${path} in DataProxy as the setter is neither a function or a controller method.`)

            return true;
         }
      });

      instance.setStore = store => {
         instance.store.setStore(store);
      };
   }
}

class DataProxyView extends ReadOnlyDataView {

   constructor(config) {
      super(config);
      this.dataSelector = getSelector(this.privateData);
      if (this.dataSelector.memoize)
         this.dataSelector = this.dataSelector.memoize();
   }

   getAdditionalData(parentStoreData) {
      if (this.meta.version !== this.cache.version)
         this.data = this.dataSelector(parentStoreData);
      return this.data;
   }

   setItem(path, value) {
      let binding = Binding.get(path);
      let bindingRoot = binding.parts[0];
      if (!isObject(this.privateData) || !this.privateData.hasOwnProperty(bindingRoot)) {
         if (isUndefined(value))
            return super.deleteItem(path);
         return super.setItem(path, value);
      }
      let newValue = value;
      if (binding.parts.length > 1)
         newValue = binding.set(this.getAdditionalData(this.store.getData()), value)[bindingRoot];
      return this.onSet(bindingRoot, newValue);
   }

   deleteItem(path) {
      return this.setItem(path, undefined);
   }
}