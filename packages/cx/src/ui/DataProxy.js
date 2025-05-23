import { NestedDataView } from "../data/NestedDataView";
import { UseParentLayout } from "../ui/layout/UseParentLayout";
import { PureContainer } from "./PureContainer";
import { StructuredInstanceDataAccessor } from "./StructuredInstanceDataAccessor";

export class DataProxy extends PureContainer {
   init() {
      if (!this.data) this.data = {};

      if (this.alias) this.data[this.alias] = this.value;

      // nesting is required to avoid resetting the store on every render and recalculating the data
      this.container = PureContainer.create({
         type: PureContainer,
         items: this.children || this.items,
         layout: this.layout,
         controller: this.controller,
         outerLayout: this.outerLayout,
         ws: this.ws,
      });
      this.children = [this.container];
      delete this.items;
      delete this.controller;
      delete this.outerLayout;
      this.layout = UseParentLayout;
      super.init();
   }

   initInstance(context, instance) {
      instance.store = new NestedDataView({
         store: instance.parentStore,
         nestedData: new StructuredInstanceDataAccessor({ instance, data: this.data, useParentStore: true }),
         immutable: this.immutable,
         sealed: this.sealed,
      });
      super.initInstance(context, instance);
   }

   applyParentStore(instance) {
      instance.store.setStore(instance.parentStore);
   }
}

DataProxy.prototype.immutable = false;
DataProxy.prototype.sealed = false;
