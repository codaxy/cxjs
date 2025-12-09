import { Widget } from "./Widget";
import { PureContainer } from "./PureContainer";
import { ContainerBase, ContainerConfig } from "./Container";
import { ArrayAdapter } from "./adapter/ArrayAdapter";
import { UseParentLayout } from "./layout/UseParentLayout";
import { getAccessor } from "../data/getAccessor";
import { RenderingContext } from "./RenderingContext";
import {
   Prop,
   StringProp,
   StructuredProp,
   RecordAlias,
   SortersProp,
   CollatorOptions,
   SortDirection,
   DataRecord,
} from "./Prop";
import { Instance } from "./Instance";
import { DataAdapter, DataAdapterRecord } from "./adapter/DataAdapter";
import type { GroupAdapter } from "./adapter/GroupAdapter";
import type { TreeAdapter } from "./adapter/TreeAdapter";
import { Create } from "../util/Component";

export interface RepeaterConfig<T = DataRecord> extends ContainerConfig {
   /** An array of records to be displayed. */
   records?: Prop<T[]>;

   /** Alias used to expose the record in the child scope. Default is `$record`. */
   recordName?: RecordAlias;

   /** Alias used to expose the record in the child scope. Default is `$record`. */
   recordAlias?: RecordAlias;

   /** Alias used to expose the index of the record. Default is `$index`. */
   indexName?: RecordAlias;

   /** Alias used to expose the index of the record. Default is `$index`. */
   indexAlias?: RecordAlias;

   /** Set to `true` to enable caching for improved performance on large datasets. */
   cached?: boolean;

   /** Indicate that parent store data should not be mutated. */
   immutable?: boolean;

   /** Indicate that record stores should not be mutated. */
   sealed?: boolean;

   /** An array of sorter configurations. */
   sorters?: SortersProp;

   /** A binding used to store the name of the field used for sorting the collection. Available only if `sorters` are not used. */
   sortField?: StringProp;

   /** A binding used to store the sort direction. Available only if `sorters` are not used. Possible values are `"ASC"` and `"DESC"`. Defaults to `"ASC"`. */
   sortDirection?: Prop<SortDirection>;

   /** Parameters that affect filtering. */
   filterParams?: StructuredProp;

   /** Callback to create a filter function for given filter params. */
   onCreateFilter?: (filterParams: any, instance: Instance) => (record: T) => boolean;

   /**
    * Callback function to track and retrieve displayed records.
    * Accepts new records as a first argument.
    * If onCreateFilter callback is defined, filtered records can be retrieved using this callback.
    */
   onTrackMappedRecords?: string | ((records: DataAdapterRecord<T>[], instance: Instance) => void);

   /** Options for data sorting. See: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator */
   sortOptions?: CollatorOptions;

   /** A field used to get the unique identifier of the record. Setting keyField improves performance on sort operations as the widget is able to track movement of records inside the collection. */
   keyField?: string;

   /** Data adapter used to convert data in the list of records. Used for manipulation of records, e.g flattening the tree records. */
   dataAdapter?:
      | Create<typeof DataAdapter>
      | Create<typeof ArrayAdapter>
      | Create<typeof TreeAdapter>
      | Create<typeof GroupAdapter>;
}

export class Repeater<Config extends RepeaterConfig = RepeaterConfig> extends ContainerBase<Config> {
   declare records?: any;
   recordsAccessor: any;
   declare recordAlias?: string;
   declare recordName: string;
   declare indexAlias?: string;
   declare indexName: string;
   declare dataAdapter: any;
   declare keyField?: string;
   declare immutable: boolean;
   declare sealed: boolean;
   declare sortOptions?: any;
   item: any;
   declare cached: boolean;
   declare onCreateFilter?: any;
   filter?: any;
   declare onTrackMappedRecords?: any;

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
      this.items = [];

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
