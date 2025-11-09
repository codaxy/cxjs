import { Widget } from "./Widget";
import { PureContainer, PureContainerConfig } from "./PureContainer";
import { Binding } from "../data/Binding";
import { ZoomIntoPropertyView } from "../data/ZoomIntoPropertyView";
import { StructuredInstanceDataAccessor } from "./StructuredInstanceDataAccessor";
import { isObject } from "../util/isObject";
import { StructuredProp } from "./Prop";

export interface RescopeConfig extends PureContainerConfig {
   bind: string;
   rootName?: string;
   rootAlias?: string;
   data?: StructuredProp;
}

export class Rescope extends PureContainer<RescopeConfig> {
   declare bind: string;
   declare binding: any;
   declare rootAlias?: string;
   declare rootName: string;
   declare data?: any;

   init() {
      this.binding = Binding.get(this.bind);
      if (this.rootAlias) this.rootName = this.rootAlias;
      super.init();
   }

   initInstance(context: any, instance: any) {
      instance.store = new ZoomIntoPropertyView({
         store: instance.parentStore,
         binding: this.binding,
         rootName: this.rootName,
         nestedData: isObject(this.data)
            ? new StructuredInstanceDataAccessor({ instance, data: this.data, useParentStore: true })
            : undefined,
      });
      super.initInstance(context, instance);
   }

   applyParentStore(instance: any) {
      instance.store.setStore(instance.parentStore);
   }
}

Rescope.prototype.bind = "$page";
Rescope.prototype.rootName = "$root";

Widget.alias("rescope", Rescope);
