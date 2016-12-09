import {Widget} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {Binding} from '../data/Binding';
import {ZoomIntoPropertyView} from '../data/ZoomIntoPropertyView';

export class Rescope extends PureContainer {
   init() {
      super.init();
      this.binding = Binding.get(this.bind);
   }

   initInstance(context, instance) {
      instance.store = new ZoomIntoPropertyView({
         store: instance.store,
         binding: this.binding,
         rootName: this.rootName
      });
      instance.setStore = store => {
         instance.store.setStore(store);
      };
   }
}

Rescope.prototype.bind = '$page';
Rescope.prototype.rootName = '$root';

Widget.alias('rescope', Rescope);