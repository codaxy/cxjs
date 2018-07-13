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
         items: this.children || this.items,
         layout: this.layout,
         controller: this.controller,
         outerLayout: this.outerLayout,
         ws: this.ws
      });
      delete this.items;
      delete this.children;
      delete this.controller;
      delete this.outerLayout;
      super.init();
   }

   initInstance(context, instance) {
      let bindings = {};
      for (let key in this.data)
         if (this.data[key] && isString(this.data[key].bind))
            bindings[key] = this.data[key].bind;

      instance.subStore = new RestateStore({
         store: instance.store,
         bindings,
         detached: this.detached
      });

      instance.setStore = store => {
         instance.store = store;
         instance.subStore.setStore(store);
      };
   }

   explore(context, instance) {
      if (!this.detached || instance.shouldUpdate) {
         //if Restate is not detached the tree must be walked for putInto widgets
         instance.container = instance.getChild(context, this.container, null, instance.subStore);
         instance.container.scheduleExploreIfVisible(context);
      }
      super.explore(context, instance);
   }

   prepareData(context, instance) {
      let {data, subStore} = instance;
      subStore.setParentData(data.data);
      super.prepareData(context, instance);
   }

   render(context, instance, key) {
      if (!this.detached)
         return instance.container.render(context);

      return <Cx
         key={key}
         instance={instance.container}
         subscribe
         options={this.options}
      />
   }
}

Restate.prototype.detached = false;

class RestateStore extends Store {

   constructor(config) {
      super(config);
      this.parentData = {};
   }

   setParentData(data) {
      let changed = this.silently(() => {
         for (let key in data) {
            super.setItem(key, data[key]);
         }
      });

      this.parentData = data;

      if (changed && this.detached)
         this.notify();
   }

   setItem(...args) {
      let changed = super.setItem(...args);
      if (changed)
         this.bubble();
      return changed;
   }

   deleteItem(...args) {
      let changed = super.deleteItem(...args);
      if (changed)
         this.bubble();
      return changed;
   }

   bubble() {
      this.store.batch(() => {
         let data = this.getData();
         for (let key in this.bindings) {
            let value = data[key];

            //Only values that have actually changed in the RestateStore are propagated to the parent store
            // to avoid race conditions that can happen due to async functions keeping the reference of the
            // restate store of an invisible widget
            if (value !== this.parentData[key]) {
               if (value === undefined)
                  this.store.delete(this.bindings[key]);
               else
                  this.store.set(this.bindings[key], value);
            }
         }
      });
   }

   doNotify(path) {
      super.doNotify(path);

      //in non-detached mode the parent store triggers a new render cycle
      if (!this.detached)
         this.store.notify();
   }
}