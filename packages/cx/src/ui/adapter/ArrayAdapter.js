import { DataAdapter, DataAdapterRecordType } from "./DataAdapter";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { sorter } from "../../data/comparer";
import { isArray } from "../../util/isArray";
import { ArrayElementView } from "../../data/ArrayElementView";
import { getAccessor } from "../../data/getAccessor";
import { Culture } from "../Culture";
import { isDefined } from "../../util";

export class ArrayAdapter extends DataAdapter {
   init() {
      this.recordsAccessor = getAccessor(this.recordsBinding ? this.recordsBinding : this.recordsAccessor);

      //resolve accessor chains
      this.recordName = this.recordName.toString();
      this.indexName = this.indexName.toString();
   }

   initInstance(context, instance) {
      if (!instance.recordStoreCache) instance.recordStoreCache = new WeakMap();
      if (!instance.recordsAccessor && this.recordsAccessor) {
         instance.recordsAccessor = this.recordsAccessor.bindInstance
            ? this.recordsAccessor.bindInstance(instance)
            : this.recordsAccessor;
      }
   }

   getRecords(context, instance, records, parentStore) {
      if (!instance.recordStoreCache) this.initInstance(context, instance);

      return this.mapRecords(context, instance, records, parentStore, instance.recordsAccessor);
   }

   mapRecords(context, instance, records, parentStore, recordsAccessor) {
      let result = [];

      if (!instance.recordStoreCache) this.initInstance(context, instance);

      if (isArray(records))
         records.forEach((data, index) => {
            if (this.filterFn && !this.filterFn(data)) return;

            let record = this.mapRecord(context, instance, data, parentStore, recordsAccessor, index);

            result.push(record);
         });

      if (this.sorter) result = this.sorter(result);

      return result;
   }

   mapRecord(context, instance, data, parentStore, recordsAccessor, index) {
      let recordStore = instance.recordStoreCache.get(data);

      if (recordsAccessor) {
         if (!recordStore)
            recordStore = new ArrayElementView({
               store: parentStore,
               arrayAccessor: recordsAccessor,
               itemIndex: index,
               recordAlias: this.recordName,
               indexAlias: this.indexName,
               immutable: this.immutable,
               sealed: this.sealed,
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
                  [this.indexName]: index,
               },
               immutable: this.immutable,
               sealed: this.sealed,
            });
         else {
            recordStore.setStore(parentStore);
         }
      }

      if (typeof data == "object") instance.recordStoreCache.set(data, recordStore);

      return {
         store: recordStore,
         index: index,
         data: data,
         type: "data",
         key: this.keyField ? data[this.keyField] : index,
      };
   }

   setFilter(filterFn) {
      this.filterFn = filterFn;
   }

   getComparer(sortOptions) {
      return sortOptions ? Culture.getComparer(sortOptions) : null;
   }

   buildSorter(sorters) {
      if (isArray(sorters) && sorters.length > 0) {
         let fieldValueMapper;
         let dataAccessor;

         //if all sorters are based on record fields access data directly (faster)
         if (sorters.every((x) => x.field && x.value == null)) {
            dataAccessor = (x) => x.data;
            fieldValueMapper = (x) => ({ bind: x.field });
         } else {
            dataAccessor = (x) => x.store.getData();
            fieldValueMapper = (x) => ({ bind: this.recordName + "." + x.field });
         }
         this.sorter = sorter(
            sorters.map((x) => {
               let s = Object.assign({}, x);
               if (s.field && s.value == null) s.value = fieldValueMapper(s);
               if (!s.comparer)
                  s.comparer = this.getComparer(isDefined(s.sortOptions) ? s.sortOptions : this.sortOptions);
               return s;
            }),
            dataAccessor
         );
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

ArrayAdapter.autoInit = true;
