import {DataAdapter} from './DataAdapter';
import {ExposedRecordView} from '../../data/ExposedRecordView';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {sorter} from '../../data/comparer';
import {isArray} from '../../util/isArray';


export class ArrayAdapter extends DataAdapter {

   initInstance(context, instance) {
      if (!instance.recordStoreCache)
         instance.recordStoreCache = new WeakMap();
   }

   getRecords(context, instance, records, parentStore) {
      return this.mapRecords(context, instance, records, parentStore, this.recordsBinding);
   }

   mapRecords(context, instance, records, parentStore, recordsBinding) {
      let result = [];

      if (!instance.recordStoreCache)
         this.initInstance(context, instance);

      if (isArray(records))
         records.forEach((data, index) => {

            if (this.filterFn && !this.filterFn(data))
               return;

            let record = this.mapRecord(context, instance, data, parentStore, recordsBinding, index);

            result.push(record);
         });

      if (this.sorter)
         result = this.sorter(result);

      return result;
   }

   mapRecord(context, instance, data, parentStore, recordsBinding, index) {
      let recordStore = instance.recordStoreCache.get(data);
      let writable = parentStore && recordsBinding;
      if (writable) {
         if (!recordStore)
            recordStore = new ExposedRecordView({
               store: parentStore,
               collectionBinding: recordsBinding,
               itemIndex: index,
               recordName: this.recordName,
               indexName: this.indexName,
               immutable: this.immutable,
               sealed: this.sealed
            });
         else {
            recordStore.setStore(parentStore);
            recordStore.setIndex(index);
         }
      } else {
         if (!recordStore)
            recordStore = new ReadOnlyDataView({
               store: parentStore,
               data: {
                  [this.recordName]: data,
                  [this.indexName]: index
               },
               immutable: this.immutable,
               sealed: this.sealed
            });
         else {
            recordStore.setStore(parentStore);
         }
      }

      if (typeof data == 'object')
         instance.recordStoreCache.set(data, recordStore);

      return {
         store: recordStore,
         index: index,
         data: data,
         type: 'data',
         key: this.keyField ? data[this.keyField] : index
      };
   }

   setFilter(filterFn) {
      this.filterFn = filterFn;
   }

   buildSorter(sorters) {
      if (isArray(sorters) && sorters.length > 0) {
         if (sorters.every(x => x.field && x.value == null)) {
            //if all sorters are based on record fields access data directly (faster)
            this.sorter = sorter(sorters.map(x => {
               if (x.field)
                  return {
                     value: {bind: x.field},
                     direction: x.direction
                  };
               return x;
            }), x => x.data)
         }
         else {
            //if some sorters use computed values, use store data object
            this.sorter = sorter(sorters.map(x => {
               if (x.field && x.value == null)
                  return {
                     value: {bind: this.recordName + '.' + x.field},
                     direction: x.direction
                  };
               return x;
            }), x => x.store.getData())
         }
      } else {
         this.sorter = null;
      }
   }

   sort(sorters) {
      this.buildSorter(sorters);
   }
}

ArrayAdapter.prototype.immutable = false;
ArrayAdapter.prototype.sealed = false;