import { DataAdapter, DataAdapterRecord, DataAdapterConfig } from "./DataAdapter";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { sorter, type ComparerSorter } from "../../data/comparer";
import { isArray } from "../../util/isArray";
import { ArrayElementView } from "../../data/ArrayElementView";
import { Accessor, getAccessor } from "../../data/getAccessor";
import { Culture } from "../Culture";
import { isDefined, isObject } from "../../util";
import { RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { View } from "../../data/View";
import { Prop, CollatorOptions } from "../Prop";

export interface RecordStoreCache {
   recordStoreCache: WeakMap<any, View>;
   /** Record stores by key, kept so that records keep their stores when they change; see pruneCache. */
   cacheByKey: Map<string | number, View>;
   recordsAccessor?: Accessor;
}

export interface ArrayAdapterConfig extends DataAdapterConfig {
   recordsBinding?: Prop<any[]>;
   recordsAccessor?: Accessor | string;
   keyField?: string;
   cacheByKeyField?: boolean;
   sortOptions?: CollatorOptions;
   preserveOrder?: boolean;
}

export interface ExtendedSorter extends ComparerSorter {
   /**
    * Collator options for this sorter, which the adapter turns into a comparer using the current culture.
    * Without them, the adapter's sortOptions apply. Ignored if the sorter has a comparer.
    */
   sortOptions?: CollatorOptions;
}

export interface ResolvedSorter {
   getter: (x: any) => any;
   factor: number;
   compare: (a: any, b: any) => number;
}

export class ArrayAdapter<T = any> extends DataAdapter<T> {
   declare public recordsAccessor: Accessor;
   declare public recordsBinding?: Prop<T[]>;
   declare public keyField: string | null;
   declare public cacheByKeyField: boolean;
   declare public sortOptions?: CollatorOptions;
   declare public preserveOrder?: boolean;
   declare isTreeAdapter: boolean;

   declare protected sorter?: (data: DataAdapterRecord<T>[]) => DataAdapterRecord<T>[];

   constructor(config?: ArrayAdapterConfig) {
      super(config);
   }

   public init(): void {
      this.recordsAccessor = this.recordsBinding ? getAccessor(this.recordsBinding) : getAccessor(this.recordsAccessor);
      this.recordName = this.recordName?.toString() || "$record";
      this.indexName = this.indexName?.toString() || "$index";
   }

   public initInstance(context: RenderingContext, instance: Instance & Partial<RecordStoreCache>): void {
      if (!instance.recordStoreCache) {
         instance.recordStoreCache = new WeakMap();
         instance.cacheByKey = new Map();
      }

      if (!instance.recordsAccessor && this.recordsAccessor) {
         instance.recordsAccessor = this.recordsAccessor.bindInstance
            ? this.recordsAccessor.bindInstance(instance)
            : this.recordsAccessor;
      }
   }

   public getRecords(
      context: RenderingContext,
      instance: Instance & Partial<RecordStoreCache>,
      records: T[],
      parentStore: View,
   ): DataAdapterRecord<T>[] {
      if (!instance.recordStoreCache) {
         this.initInstance(context, instance);
      }

      let result = this.mapRecords(context, instance, records, parentStore, instance.recordsAccessor);
      // the result holds all mapped records, including the children of expanded tree nodes
      this.prune(instance, result, (record) => record.data);
      return result;
   }

   /**
    * Prunes the record stores cached by key, once the cache holds more than twice as many stores as there are
    * records: the stores of records that are no longer in `records` are dropped, and those of the records that stay
    * are kept. Stores cached by record (without a key) are released with their records. Called by getRecords, and by
    * widgets that map records on demand with mapRecord.
    */
   public pruneCache(instance: Instance & Partial<RecordStoreCache>, records: T[]): void {
      if (isArray(records)) this.prune(instance, records, (data) => data);
   }

   /** Prunes the cache to the stores of the records of `items`; see pruneCache. */
   protected prune<I>(instance: Instance & Partial<RecordStoreCache>, items: I[], getData: (item: I) => T): void {
      let cache = instance.cacheByKey;
      if (!cache || cache.size <= 2 * items.length + 32) return;
      let kept = new Map<string | number, View>();
      for (let item of items) {
         let data = getData(item);
         let key = isObject(data) ? (data as any)[this.keyField!] : null;
         let store = key != null ? cache.get(key) : undefined;
         if (store) kept.set(key, store);
      }
      instance.cacheByKey = kept;
   }

   public mapRecords(
      context: RenderingContext,
      instance: Instance & Partial<RecordStoreCache>,
      records: T[],
      parentStore: View,
      recordsAccessor?: Accessor,
   ): DataAdapterRecord<T>[] {
      let result: DataAdapterRecord<T>[] = [];

      if (!instance.recordStoreCache) {
         this.initInstance(context, instance);
      }

      if (isArray(records)) {
         records.forEach((data, index) => {
            if (this.filterFn && !this.filterFn(data)) return;

            const record = this.mapRecord(context, instance, data, parentStore, recordsAccessor, index);
            result.push(record);
         });
      }

      if (this.sorter && !this.preserveOrder) {
         result = this.sorter(result);
      }

      return result;
   }

   public mapRecord(
      context: RenderingContext,
      instance: Instance & Partial<RecordStoreCache>,
      data: T,
      parentStore: View,
      recordsAccessor: Accessor | undefined,
      index: number,
   ): DataAdapterRecord<T> {
      const key = this.cacheByKeyField && this.keyField && isObject(data) ? (data as any)[this.keyField] : null;
      let recordStore = key != null ? instance.cacheByKey!.get(key) : instance.recordStoreCache!.get(data);

      if (recordsAccessor) {
         if (!recordStore) {
            recordStore = new ArrayElementView({
               store: parentStore,
               arrayAccessor: recordsAccessor,
               itemIndex: index,
               recordAlias: this.recordName,
               indexAlias: this.indexName,
               immutable: this.immutable,
               sealed: this.sealed,
            });
         } else {
            (recordStore as ArrayElementView).setStore(parentStore);
            (recordStore as ArrayElementView).setIndex(index);
         }
      } else {
         if (!recordStore) {
            recordStore = new ReadOnlyDataView({
               store: parentStore,
               data: {
                  [this.recordName]: data,
                  [this.indexName]: index,
               },
               immutable: this.immutable,
               sealed: this.sealed,
            });
         } else {
            (recordStore as ReadOnlyDataView).setStore(parentStore);
            (recordStore as ReadOnlyDataView).setData({
               [this.recordName]: data,
               [this.indexName]: index,
            });
         }
      }

      if (key != null) {
         instance.cacheByKey!.set(key, recordStore);
      } else if (isObject(data)) {
         instance.recordStoreCache!.set(data, recordStore);
      }

      return {
         store: recordStore,
         index: index,
         data: data,
         type: "data",
         key: this.keyField && isObject(data) ? (data as any)[this.keyField] : index,
      };
   }

   public setFilter(filterFn?: (data: T) => boolean): void {
      this.filterFn = filterFn;
   }

   public getComparer(sortOptions?: CollatorOptions): ((a: any, b: any) => number) | undefined {
      return sortOptions ? Culture.getComparer(sortOptions) : undefined;
   }

   public buildSorter(sorters?: ExtendedSorter[]): void {
      if (isArray(sorters) && sorters.length > 0) {
         let dataAccessor: (x: DataAdapterRecord<T>) => any;
         let fieldValueMapper: (x: ExtendedSorter) => Prop<any>;

         if (sorters.every((x) => x.field && x.value == null)) {
            dataAccessor = (x) => x.data;
            fieldValueMapper = (x) => ({ bind: x.field! });
         } else {
            dataAccessor = (x) => x.store.getData();
            fieldValueMapper = (x) => ({ bind: this.recordName + "." + x.field });
         }

         this.sorter = sorter(
            sorters.map((x) => {
               const s: ExtendedSorter = Object.assign({}, x);
               if (s.field && s.value == null) {
                  s.value = fieldValueMapper(s);
               }
               if (!s.comparer) {
                  s.comparer = this.getComparer(isDefined(s.sortOptions) ? s.sortOptions : this.sortOptions);
               }
               return s;
            }),
            dataAccessor,
         );
      } else {
         this.sorter = undefined;
      }
   }

   /** Sorts the records with the given sorters; without sorters, the records keep their original order. */
   public sort(sorters?: ExtendedSorter[]): void {
      this.buildSorter(sorters);
   }
}

ArrayAdapter.prototype.immutable = false;
ArrayAdapter.prototype.sealed = false;
ArrayAdapter.prototype.keyField = null;
ArrayAdapter.prototype.cacheByKeyField = true;
ArrayAdapter.prototype.isTreeAdapter = false;

ArrayAdapter.autoInit = true;
