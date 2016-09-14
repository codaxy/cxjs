import {DataAdapter} from './DataAdapter';
import {ExposedRecordView} from '../../data/ExposedRecordView';
import {ReadOnlyDataView} from '../../data/ReadOnlyDataView';
import {sorter} from '../../data/comparer';


export class ArrayAdapter extends DataAdapter {

   init() {
      this.map = new WeakMap();
   }

   getRecords(context, instance, records, parentStore) {      
      return this.mapRecords(context, instance, records, parentStore, this.recordsBinding);
   }

   mapRecords(context, instance, records, parentStore, recordsBinding) {
      var result = [];
      var writable = parentStore && recordsBinding;

      if (Array.isArray(records))
         records.forEach((data, index)=> {

            if (this.filterFn && !this.filterFn(data))
               return;

            var recordStore = this.map.get(data);
            if (writable) {
               if (!recordStore)
                  recordStore = new ExposedRecordView(parentStore, recordsBinding, index, this.recordName, this.indexName);
               else {
                  recordStore.setStore(parentStore);
                  recordStore.setIndex(index);
               }
            } else {
               if (!recordStore)
                  recordStore = new ReadOnlyDataView(parentStore, {
                     [this.recordName]: data,
                     [this.indexName]: index
                  });
            }

            if (typeof data == 'object')
               this.map.set(data, recordStore);

            //TODO: filter

            result.push({
               store: recordStore,
               index: index,
               data: data,
               type: 'data',
               key: this.keyField ? data[this.keyField] : index
            });
         });

      if (this.sorter)
         result = this.sorter(result);

      return result;
   }

   setFilter(filterFn) {
      this.filterFn = filterFn;
   }

   buildSorter(sorters) {
      if (Array.isArray(sorters) && sorters.length > 0) {
         if (sorters.every(x=>x.field)) {
            //if all sorters are based on record fields access data directly (faster)
            this.sorter = sorter(sorters.map(x=> {
               if (x.field)
                  return {
                     value: {bind: x.field},
                     direction: x.direction
                  }
               return x;
            }), x=>x.data)
         }
         else {
            //if some sorters use computed values, use store data object
            this.sorter = sorter(sorters.map(x=> {
               if (x.field)
                  return {
                     value: {bind: this.recordName + '.' + x.field},
                     direction: x.direction
                  };
               return x;
            }), x=>x.store.getData())
         }
      } else {
         this.sorter = null;
      }
   }

   sort(sorters) {
      this.buildSorter(sorters);
   }
}
