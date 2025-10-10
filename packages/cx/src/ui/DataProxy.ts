import { NestedDataView } from "../data/NestedDataView";
import { UseParentLayout } from "../ui/layout/UseParentLayout";
import { PureContainer } from "./PureContainer";
import { StructuredInstanceDataAccessor } from "./StructuredInstanceDataAccessor";

export class DataProxy extends PureContainer {
   data?: any;
   alias?: string;
   value?: any;
   immutable: boolean;
   sealed: boolean;

   init() {
      if (!this.data) this.data = {};

      if (this.alias) this.data[this.alias] = this.value;

      super.init();
   }

   initInstance(context: any, instance: any) {
      instance.store = new NestedDataView({
         store: instance.parentStore,
         nestedData: new StructuredInstanceDataAccessor({ instance, data: this.data, useParentStore: true }),
         immutable: this.immutable,
         sealed: this.sealed,
      });
      super.initInstance(context, instance);
   }

   applyParentStore(instance: any) {
      instance.store.setStore(instance.parentStore);
   }
}

DataProxy.prototype.immutable = false;
DataProxy.prototype.sealed = false;
