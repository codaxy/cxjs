import { DataAdapter, DataAdapterRecord, DataAdapterConfig } from "./DataAdapter";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { sorter } from "../../data/comparer";
import { isArray } from "../../util/isArray";
import { ArrayElementView } from "../../data/ArrayElementView";
import { Accessor, getAccessor } from "../../data/getAccessor";
import { Culture } from "../Culture";
import { isDefined, isObject } from "../../util";
import { RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { View } from "../../data/View";
import { Prop, Sorter, CollatorOptions } from "../Prop";

export interface RecordStoreCache {
   recordStoreCache: WeakMap<any, View>;
   cacheByKey: Record<string | number, View>;
   recordsAccessor?: Accessor;
}

export interface ArrayAdapterConfig extends DataAdapterConfig {
   recordsBinding?: Prop<any[]>;
   recordsAccessor?: Accessor | string;
   keyField?: string;
   cacheByKeyField?: boolean;
   sortOptions?: CollatorOptions;
}

export interface ExtendedSorter extends Sorter {
   comparer?: (a: any, b: any) => number;
   sortOptions?: CollatorOptions;
}

export interface ResolvedSorter {
   getter: (x: any) => any;
   factor: number;
   compare: (a: any, b: any) => number;
}

export class ArrayAdapter<T = any> extends DataAdapter<T> {
   public recordsAccessor: Accessor;
   public recordsBinding?: Prop<T[]>;
   public keyField: string | null;
   public cacheByKeyField: boolean;
   public sortOptions?: CollatorOptions;

   protected sorter?: (data: DataAdapterRecord<T>[]) => DataAdapterRecord<T>[];

   constructor(config?: ArrayAdapterConfig) {
      super(config);
   }

   public init(): void {
      this.recordsAccessor = getAccessor(this.recordsBinding ?? this.recordsAccessor);
      this.recordName = this.recordName?.toString() || "$record";
      this.indexName = this.indexName?.toString() || "$index";
   }

   public initInstance(context: RenderingContext, instance: Instance & Partial<RecordStoreCache>): void {
      if (!instance.recordStoreCache) {
         instance.recordStoreCache = new WeakMap();
         instance.cacheByKey = {};
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

      return this.mapRecords(context, instance, records, parentStore, instance.recordsAccessor);
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

      if (this.sorter) {
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
      let recordStore = key != null ? instance.cacheByKey![key] : instance.recordStoreCache!.get(data);

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
            (recordStore as ReadOnlyDataView).setData(data);
         }
      }

      if (key != null) {
         instance.cacheByKey![key] = recordStore;
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

   public buildSorter(sorters: ExtendedSorter[]): void {
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

   public sort(sorters?: Sorter[] | ExtendedSorter[]): void {
      if (sorters) {
         this.buildSorter(sorters as ExtendedSorter[]);
      }
   }
}

ArrayAdapter.prototype.immutable = false;
ArrayAdapter.prototype.sealed = false;
ArrayAdapter.prototype.keyField = null;
ArrayAdapter.prototype.cacheByKeyField = true;

ArrayAdapter.autoInit = true;
