import {View} from './View';
import {Binding} from './Binding';

export class ExposedRecordView extends View {

   constructor(store, collectionBinding, itemIndex, recordPath, indexPath) {
      super();
      this.store = store;
      this.recordPath = recordPath;
      this.indexPath = indexPath;
      this.collectionBinding = collectionBinding;
      this.itemIndex = itemIndex;
   }

   getData() {
      var data = this.store.getData();
      return this.embed(data);
   }

   embed(data) {
      var collection = this.collectionBinding.value(data);
      var record = collection[this.itemIndex];
      data[this.recordPath] = record;
      if (this.indexPath)
         data[this.indexPath] = this.itemIndex;
      return data;
   }

   setStore(store) {
      this.store = store;
   }

   setIndex(index) {
      this.itemIndex = index;
   }

   set(path, value) {
      if (path instanceof Binding)
         path = path.path;
      if (path == this.recordPath || path.indexOf(this.recordPath + '.') == 0) {
         var storeData = this.store.getData();
         var collection = this.collectionBinding.value(storeData);
         var data = this.embed(storeData);
         var d = Binding.get(path).set(data, value);
         if (d != data) {
            var record = d[this.recordPath];
            var newCollection = [...collection.slice(0, this.itemIndex), record, ...collection.slice(this.itemIndex + 1)]
            this.store.set(this.collectionBinding, newCollection);
         }
      } else {
         this.store.set(path, value);
      }
   }

   delete(path) {
      if (path instanceof Binding)
         path = path.path;

      var storeData, collection, newCollection;

      if (path == this.recordPath) {
         storeData = this.store.getData();
         collection = this.collectionBinding.value(storeData);
         newCollection = [...collection.slice(0, this.itemIndex), ...collection.slice(this.itemIndex + 1)];
         this.store.set(this.collectionBinding, newCollection);
      }
      else if (path.indexOf(this.recordPath + '.') == 0) {
         storeData = this.store.getData();
         collection = this.collectionBinding.value(storeData);
         var data = this.embed(storeData);
         var d = Binding.get(path).delete(data);
         if (d != data) {
            var record = d[this.recordPath];
            newCollection = [...collection.slice(0, this.itemIndex), record, ...collection.slice(this.itemIndex + 1)]
            this.store.set(this.collectionBinding, newCollection);
         }
      } else {
         this.store.delete(path);
      }
   }
}
