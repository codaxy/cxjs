import { NestedDataView } from "../data/NestedDataView";
import { UseParentLayout } from "../ui/layout/UseParentLayout";
import { PureContainerBase, PureContainerConfig } from "./PureContainer";
import { StructuredInstanceDataAccessor } from "./StructuredInstanceDataAccessor";
import { StructuredProp, Bind } from "./Prop";

export interface DataProxyConfig extends PureContainerConfig {
   data?: StructuredProp;
   value?: Bind;
   alias?: string;
   cached?: boolean;
   immutable?: boolean;
   sealed?: boolean;
}

export class DataProxy extends PureContainerBase<DataProxyConfig> {
   declare data?: any;
   declare alias?: string;
   declare value?: any;
   declare cached?: boolean;
   declare immutable: boolean;
   declare sealed: boolean;

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
