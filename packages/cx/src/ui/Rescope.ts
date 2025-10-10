import { Widget } from "./Widget";
import { PureContainer } from "./PureContainer";
import { Binding } from "../data/Binding";
import { ZoomIntoPropertyView } from "../data/ZoomIntoPropertyView";
import { StructuredInstanceDataAccessor } from "./StructuredInstanceDataAccessor";
import { isObject } from "../util/isObject";

export class Rescope extends PureContainer {
   bind: string;
   binding: any;
   rootAlias?: string;
   rootName: string;
   data?: any;

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
            : null,
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
