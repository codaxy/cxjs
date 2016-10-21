import {View} from './View';
import {Binding} from './Binding';

export class ZoomIntoPropertyView extends View {

   getData() {
      var data = this.store.getData();
      if (this.storeData != data) {
         var x = this.binding.value(data);
         if (x != null && typeof x != 'object')
            throw new Error('Zoomed value must be an object.');
         this.data = {
            ...x,
            [this.rootName]: data
         };
         this.storeData = data;
      }
      return this.data;
   }

   setStore(store) {
      this.store = store;
   }

   set(path, value) {
      if (path instanceof Binding)
         path = path.path;
      if (path.indexOf(this.rootName + '.') == 0)
         this.store.set(path.substring(this.rootName.length + 1), value);
      else
         this.store.set(this.binding.path + '.' + path, value);
   }

   delete(path) {
      if (path instanceof Binding)
         path = path.path;

      if (path.indexOf(this.rootName + '.') == 0)
         this.store.delete(path.substring(this.rootName.length + 1));
      else
         this.store.delete(this.binding.path + '.' + path);
   }
}

ZoomIntoPropertyView.prototype.rootName = '$root';

