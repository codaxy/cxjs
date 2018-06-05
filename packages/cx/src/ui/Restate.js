import {PureContainer} from "./PureContainer";
import {Store} from '../data/Store';
import {Cx} from './Cx';
import {isString} from "../util/isString";
import {VDOM} from "./VDOM";

export class Restate extends PureContainer {

   declareData() {
      return super.declareData(...arguments, {
         data: {structured: true}
      })
   }

   init() {
      this.container = PureContainer.create({
         type: PureContainer,
         items: this.children || this.items
      });
      delete this.items;
      delete this.children;
      super.init();
   }

   initInstance(context, instance) {
      let bindings = {};
      for (let key in this.data)
         if (this.data[key] && isString(this.data[key].bind))
            bindings[key] = this.data[key].bind;

      instance.subStore = new RestateStore({
         store: instance.store,
         bindings
      });
   }

   prepareData(context, instance) {
      let {data, subStore} = instance;
      subStore.setParentData(data.data);
   }

   render(context, instance, key) {
      return <Cx
         key={key}
         widget={this.container}
         store={instance.subStore}
         parentInstance={instance}
         subscribe
         options={this.options}
      />
   }
}

class RestateStore extends Store {

   setParentData(data) {
      this.batch(() => {
         for (let key in data) {
            this.set(key, data[key]);
         }
      });
   }

   setItem(...args) {
      return this.wrapper(() => {
         super.setItem(...args);
      });
   }

   deleteItem(...args) {
      return this.wrapper(()=>{
         super.deleteItem(...args);
      })
   }

   wrapper(callback) {
      let result = callback();
      let data = this.getData();
      for (let key in this.bindings) {
         let value = data[key];
         if (value === undefined)
            this.store.delete(this.bindings[key]);
         else
            this.store.set(this.bindings[key], value);
      }
      return result;
   }
}