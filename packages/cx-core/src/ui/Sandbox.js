import {Widget} from './Widget';
import {PureContainer} from './PureContainer';
import {Binding} from '../data/Binding';
import {ExposedValueView} from '../data/ExposedValueView';

export class Sandbox extends PureContainer {
   init() {
      super.init();
      this.storageBinding = Binding.get(this.storage.bind);
   }

   initInstance(context, instance) {
      instance.store = new ExposedValueView(instance.store, this.storageBinding, null, this.recordName);
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
         instance.store = new ExposedValueView(store, this.storageBinding, data.key, this.recordName);

         //when navigating to a page using the same widget tree as the previous page
         //everything needs to be reinstantiated, e.g. user/1 => user/2
         instance.clearChildrenCache();
      }
      super.prepareData(context, instance);
   }
}

Sandbox.prototype.recordName = '$page';

Widget.alias('sandbox', Sandbox);