import { Widget } from "./Widget";
import { PureContainer } from "./PureContainer";
import { ContainerBase, ContainerConfig } from "./Container";
import { ArrayAdapter } from "./adapter/ArrayAdapter";
import { UseParentLayout } from "./layout/UseParentLayout";
import { getAccessor } from "../data/getAccessor";
import { RenderingContext } from "./RenderingContext";
import { Prop, StringProp, BooleanProp, StructuredProp, RecordAlias, SortersProp, CollatorOptions, SortDirection, DataRecord } from "./Prop";
import { Instance } from "./Instance";
import { DataAdapterRecord } from "./adapter/DataAdapter";

export interface RepeaterConfig<T = DataRecord> extends ContainerConfig {
   records?: Prop<T[]>;
   recordName?: RecordAlias;
   recordAlias?: RecordAlias;
   indexName?: RecordAlias;
   indexAlias?: RecordAlias;
   cached?: BooleanProp;
   immutable?: BooleanProp;
   sealed?: BooleanProp;
   sorters?: SortersProp;
   sortField?: StringProp;
   sortDirection?: Prop<SortDirection>;
   filterParams?: StructuredProp;
   onCreateFilter?: (filterParams: any, instance: Instance) => (record: T) => boolean;
   onTrackMappedRecords?: string | ((records: DataAdapterRecord<T>[], instance: Instance) => void);
   sortOptions?: CollatorOptions;
   keyField?: StringProp;
   dataAdapter?: any;
}

export class Repeater<Config extends RepeaterConfig = RepeaterConfig> extends ContainerBase<Config> {
   records?: any;
   recordsAccessor: any;
   recordAlias?: string;
   recordName: string;
   indexAlias?: string;
   indexName: string;
   dataAdapter: any;
   keyField?: string;
   immutable: boolean;
   sealed: boolean;
   sortOptions?: any;
   item: any;
   cached: boolean;
   onCreateFilter?: any;
   filter?: any;
   onTrackMappedRecords?: any;

   declareData(...args: any[]) {
      super.declareData(
         {
            records: undefined,
            sorters: undefined,
            sortField: undefined,
            sortDirection: undefined,
            filterParams: {
               structured: true,
            },
         },
         ...args,
      );
   }

   init() {
      this.recordsAccessor = getAccessor(this.records);

      if (this.recordAlias) this.recordName = this.recordAlias;

      if (this.indexAlias) this.indexName = this.indexAlias;

      this.dataAdapter = ArrayAdapter.create({
         ...this.dataAdapter,
         recordName: this.recordName,
         indexName: this.indexName,
         keyField: this.keyField,
         immutable: this.immutable,
         sealed: this.sealed,
         recordsAccessor: this.recordsAccessor,
         sortOptions: this.sortOptions,
      });

      this.item = PureContainer.create({
         children: this.items || this.children,
         layout: UseParentLayout,
      });

      delete this.children;
      delete this.items;

      super.init();
   }

   initInstance(context: RenderingContext, instance: any): void {
      this.dataAdapter.initInstance(context, instance);
   }

   applyParentStore(instance: any): void {
      super.applyParentStore(instance);

      // force prepareData to execute again and propagate the store change to the records
      if (instance.cached) delete instance.cached.rawData;
   }

   prepareData(context: RenderingContext, instance: any): void {
      let { data } = instance;
      if (data.sortField)
         data.sorters = [
            {
               field: data.sortField,
               direction: data.sortDirection || "ASC",
            },
         ];
      this.dataAdapter.sort(data.sorters);
      let filter = null;
      if (this.onCreateFilter) filter = instance.invoke("onCreateFilter", data.filterParams, instance);
      else if (this.filter) filter = (item: any) => this.filter(item, data.filterParams);
      this.dataAdapter.setFilter(filter);
      instance.mappedRecords = this.dataAdapter.getRecords(context, instance, data.records, instance.store);

      if (this.onTrackMappedRecords) {
         instance.invoke("onTrackMappedRecords", instance.mappedRecords, instance);
      }

      super.prepareData(context, instance);
   }

   explore(context: RenderingContext, instance: any, data?: any): void {
      let instances: any[] = [];
      instance.mappedRecords.forEach((record: any) => {
         let subInstance = instance.getChild(context, this.item, record.key, record.store);
         let changed = subInstance.cache("recordData", record.data) || subInstance.cache("key", record.key);
         subInstance.record = record;
         if (this.cached && !changed && subInstance.visible && !subInstance.childStateDirty) {
            instances.push(subInstance);
            subInstance.shouldUpdate = false;
         } else if (subInstance.scheduleExploreIfVisible(context)) instances.push(subInstance);
      });
      instance.children = instances;
   }
}

Repeater.prototype.recordName = "$record";
Repeater.prototype.indexName = "$index";
Repeater.prototype.cached = false;
Repeater.prototype.immutable = false;
Repeater.prototype.sealed = false;
Repeater.prototype.isPureContainer = true;

Widget.alias("repeater", Repeater);
