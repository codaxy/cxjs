import { Widget } from "../ui/Widget";
import { PureContainer } from "../ui/PureContainer";
import { Binding } from "../data/Binding";
import { ExposedValueView } from "../data/ExposedValueView";

export class Sandbox extends PureContainer {
   init() {
      if (this.recordAlias) this.recordName = this.recordAlias;

      if (this.accessKey) this.key = this.accessKey;

      this.storageBinding = Binding.get(this.storage);

      super.init();
   }

   initInstance(context, instance) {
      instance.store = new ExposedValueView({
         store: instance.parentStore,
         containerBinding: this.storageBinding,
         key: null,
         recordName: this.recordName,
         immutable: this.immutable,
      });
      super.initInstance(context, instance);
   }

   applyParentStore(instance) {
      instance.store.setStore(instance.parentStore);
   }

   declareData() {
      super.declareData(
         {
            storage: undefined,
            key: undefined,
         },
         ...arguments,
      );
   }

   prepareData(context, instance) {
      var { store, data } = instance;
      if (store.getKey() !== data.key) {
         //when navigating to a page using the same widget tree as the previous page
         //everything needs to be reinstantiated, e.g. user/1 => user/2
         instance.store = new ExposedValueView({
            store: store,
            containerBinding: this.storageBinding,
            key: data.key,
            recordName: this.recordName,
            immutable: this.immutable,
            sealed: this.sealed,
         });
         instance.clearChildrenCache();
      }
      super.prepareData(context, instance);
   }
}

Sandbox.prototype.recordName = "$page";
Sandbox.prototype.immutable = false;
Sandbox.prototype.sealed = false;

Widget.alias("sandbox", Sandbox);
