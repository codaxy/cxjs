import {Widget} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {Binding} from '../data/Binding';
import {ExposedValueView} from '../data/ExposedValueView';

export class Sandbox extends PureContainer {
   init() {
      if (this.recordAlias)
         this.recordName = this.recordAlias;

      if (this.accessKey)
         this.key = this.accessKey;

      this.storageBinding = Binding.get(this.storage.bind);
      super.init();
   }

   initInstance(context, instance) {
      instance.store = new ExposedValueView({
         store: instance.store,
         containerBinding: this.storageBinding, key: null,
         recordName: this.recordName,
         immutable: this.immutable
      });
      instance.setStore = store => {
         instance.store.setStore(store);
      };
   }

   declareData() {
      super.declareData({
         storage: undefined,
         key: undefined
      }, ...arguments);
   }

   prepareData(context, instance) {
      var {store, data} = instance;
      if (store.getKey() !== data.key) {
         instance.store = new ExposedValueView({
            store: store,
            containerBinding: this.storageBinding,
            key: data.key,
            recordName: this.recordName,
            immutable: this.immutable
         });

         //when navigating to a page using the same widget tree as the previous page
         //everything needs to be reinstantiated, e.g. user/1 => user/2
         instance.clearChildrenCache();
      }
      super.prepareData(context, instance);
   }
}

Sandbox.prototype.recordName = '$page';
Sandbox.prototype.immutable = false;

Widget.alias('sandbox', Sandbox);