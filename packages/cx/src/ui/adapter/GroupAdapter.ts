import { ArrayAdapter, ArrayAdapterConfig, RecordStoreCache } from "./ArrayAdapter";
import { DataAdapterRecord } from "./DataAdapter";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { Grouper } from "../../data/Grouper";
import { isArray } from "../../util/isArray";
import { isDefined } from "../../util/isDefined";
import { getComparer } from "../../data/comparer";
import { Culture } from "../Culture";
import { isObject } from "../../util/isObject";
import { RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { View } from "../../data/View";
import * as Cx from "../../core";

export interface GroupKey {
   [field: string]: Cx.Prop<any> | { value: Cx.Prop<any>; direction: Cx.SortDirection };
}

export interface GroupingConfig {
   key: GroupKey;
   aggregates?: Cx.StructuredProp;
   text?: Cx.Prop<string>;
   includeHeader?: boolean;
   includeFooter?: boolean;
   comparer?: ((a: any, b: any) => number) | null;
   header?: any;
   footer?: any;
}

export interface ResolvedGrouping extends GroupingConfig {
   grouper: Grouper;
}

export interface GroupData {
   $name: string;
   $level: number;
   $records: DataAdapterRecord<any>[];
   $key: string;
   [key: string]: any;
}

export interface GroupAdapterRecord<T = any> extends DataAdapterRecord<T> {
   group?: GroupData;
   grouping?: ResolvedGrouping;
   level?: number;
}

export interface GroupAdapterConfig extends ArrayAdapterConfig {
   aggregates?: Cx.StructuredProp;
   groupRecordsAlias?: string;
   groupRecordsName?: string;
   groupings?: GroupingConfig[] | null;
   groupName?: string;
}

export class GroupAdapter<T = any> extends ArrayAdapter<T> {
   public aggregates?: Cx.StructuredProp;
   public groupRecordsAlias?: string;
   public groupRecordsName?: string;
   public groupings?: ResolvedGrouping[] | null;
   public groupName: string;

   constructor(config?: GroupAdapterConfig) {
      super(config);
   }

   public init(): void {
      super.init();

      if (this.groupRecordsAlias) {
         this.groupRecordsName = this.groupRecordsAlias;
      }

      if (this.groupings) {
         this.groupBy(this.groupings);
      }
   }

   public getRecords(
      context: RenderingContext,
      instance: Instance & Partial<RecordStoreCache>,
      records: T[],
      parentStore: View,
   ): DataAdapterRecord<T>[] {
      let result = super.getRecords(context, instance, records, parentStore);

      if (this.groupings) {
         const groupedResults: DataAdapterRecord<T>[] = [];
         this.processLevel([], result, groupedResults, parentStore);
         result = groupedResults;
      }

      return result;
   }

   protected processLevel(
      keys: any[],
      records: DataAdapterRecord<T>[],
      result: DataAdapterRecord<T>[],
      parentStore: View,
   ): void {
      const level = keys.length;
      const inverseLevel = this.groupings!.length - level;

      if (inverseLevel === 0) {
         for (let i = 0; i < records.length; i++) {
            (records[i].store as ReadOnlyDataView).setStore(parentStore);
            result.push(records[i]);
         }
         return;
      }

      const grouping = this.groupings![level];
      const { grouper } = grouping;
      grouper.reset();
      grouper.processAll(records);
      let results = grouper.getResults();

      if (grouping.comparer) {
         results.sort(grouping.comparer);
      }

      results.forEach((gr) => {
         keys.push(gr.key);

         const key = keys.map(serializeKey).join("|");

         const $group: GroupData = {
            ...gr.key,
            ...gr.aggregates,
            $name: gr.name,
            $level: inverseLevel,
            $records: gr.records || [],
            $key: key,
         };

         const data = {
            [this.recordName]: gr.records.length > 0 ? gr.records[0].data : null,
            [this.groupName]: $group,
         };

         const groupStore = new ReadOnlyDataView({
            store: parentStore,
            data,
            immutable: this.immutable,
         });

         const group: GroupAdapterRecord<T> = {
            key,
            data: data as T,
            group: $group,
            grouping,
            store: groupStore,
            level: inverseLevel,
         };

         if (grouping.includeHeader !== false) {
            result.push({
               ...group,
               type: "group-header",
               key: "header:" + group.key,
            });
         }

         this.processLevel(keys, gr.records, result, groupStore);

         if (grouping.includeFooter !== false) {
            result.push({
               ...group,
               type: "group-footer",
               key: "footer:" + group.key,
            });
         }

         keys.pop();
      });
   }

   public groupBy(groupings: GroupingConfig[] | null): void {
      if (!groupings) {
         this.groupings = null;
      } else if (isArray(groupings)) {
         this.groupings = groupings as unknown as ResolvedGrouping[];
         this.groupings.forEach((g) => {
            const groupSorters: Cx.Sorter[] = [];
            const key: Record<string, Cx.Prop<any>> = {};

            for (const name in g.key) {
               const keyConfig = g.key[name];
               if (!keyConfig || typeof keyConfig !== "object" || !("value" in keyConfig)) {
                  g.key[name] = { value: keyConfig as Cx.Prop<any>, direction: "ASC" };
               }

               const resolvedKey = g.key[name] as { value: Cx.Prop<any>; direction: Cx.SortDirection };
               key[name] = resolvedKey.value;
               groupSorters.push({
                  field: name,
                  direction: resolvedKey.direction,
               });
            }

            g.grouper = new Grouper(
               key,
               { ...this.aggregates, ...g.aggregates },
               (r: DataAdapterRecord<T>) => r.store.getData(),
               g.text,
            );

            if (g.comparer == null && groupSorters.length > 0) {
               g.comparer = getComparer(
                  groupSorters,
                  (x: any) => x.key,
                  this.sortOptions ? Culture.getComparer(this.sortOptions) : null,
               );
            }
         });
      } else {
         throw new Error("Invalid grouping provided.");
      }
   }
}

GroupAdapter.prototype.groupName = "$group";

function serializeKey(data: any): string {
   if (isObject(data)) {
      return Object.keys(data)
         .map((k) => serializeKey(data[k]))
         .join(":");
   }
   return data?.toString() ?? "";
}
