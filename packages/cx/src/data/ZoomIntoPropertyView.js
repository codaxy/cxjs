import {View} from './View';
import {Binding} from './Binding';

export class ZoomIntoPropertyView extends View {

   getData() {
      if (this.cache.version != this.meta.version) {
         var data = this.store.getData();
         var x = this.binding.value(data);
         if (x != null && typeof x != 'object')
            throw new Error('Zoomed value must be an object.');
         this.cache.result = {
            ...x,
            [this.rootName]: !this.store.sealed ? {...data} : data
         };
         this.cache.version = this.meta.version;
      }
      return this.cache.result;
   }

   setItem(path, value) {
      if (path.indexOf(this.rootName + '.') == 0)
         this.store.setItem(path.substring(this.rootName.length + 1), value);
      else
         this.store.setItem(this.binding.path + '.' + path, value);
   }

   deleteItem(path) {
      if (path instanceof Binding)
         path = path.path;

      if (path.indexOf(this.rootName + '.') == 0)
         this.store.deleteItem(path.substring(this.rootName.length + 1));
      else
         this.store.deleteItem(this.binding.path + '.' + path);
   }
}

ZoomIntoPropertyView.prototype.rootName = '$root';

