import { getComparer } from "../../data/comparer";
import { Grouper } from "../../data/Grouper";
import { ReadOnlyDataView } from "../../data/ReadOnlyDataView";
import { View } from "../../data/View";
import { isDataRecord } from "../../util";
import { isArray } from "../../util/isArray";
import { isDefined } from "../../util/isDefined";
import { isNonEmptyArray } from "../../util/isNonEmptyArray";
import { Culture } from "../Culture";
import { Instance } from "../Instance";
import { Prop, SortDirection, Sorter, StructuredProp } from "../Prop";
import { RenderingContext } from "../RenderingContext";
import { ArrayAdapter, ArrayAdapterConfig, ExtendedSorter, RecordStoreCache } from "./ArrayAdapter";
import { DataAdapterRecord } from "./DataAdapter";

export interface GroupKey {
   [field: string]: Prop<any> | { value: Prop<any>; direction: SortDirection };
}

export interface GroupingConfig {
   key: GroupKey;
   aggregates?: StructuredProp;
   text?: Prop<string>;
   includeHeader?: boolean;
   includeFooter?: boolean;
   /** Custom group comparer. Takes precedence over `sortField`/`sortDirection`/`sorters`. */
   comparer?: ((a: any, b: any) => number) | null;
   /**
    * Sort groups by a single field resolved against the group's `key`, `aggregates` and `name`.
    * Use an aggregate alias (e.g. `"total"`) to sort by an aggregate, or a key field to sort by key.
    */
   sortField?: string;
   /** Sort direction used together with `sortField`. Defaults to `"ASC"`. */
   sortDirection?: SortDirection;
   /** Multi-field group sorting. Each sorter's `field` is resolved against the group's `key`, `aggregates` and `name`. */
   sorters?: Sorter[];
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
   aggregates?: StructuredProp;
   groupRecordsAlias?: string;
   groupRecordsName?: string;
   groupings?: GroupingConfig[] | null;
   groupName?: string;
   /** When enabled, the active record sorters also reorder groups (resolved against each group's key/aggregates/name). */
   sortGroupsBySorters?: boolean;
}

export class GroupAdapter<T = any> extends ArrayAdapter<T> {
   declare public aggregates?: StructuredProp;
   declare public groupRecordsAlias?: string;
   declare public groupRecordsName?: string;
   declare public groupings?: ResolvedGrouping[] | null;
   declare public groupName: string;
   declare public sortGroupsBySorters?: boolean;

   /**
    * Per-level comparer derived from the active record sorters, used to reorder groups when
    * `sortGroupsBySorters` is set. A level's entry is `null` when no active sorter maps to that
    * level's key/aggregate, so the grouping's own configured order is kept.
    */
   protected groupSortComparers?: (((a: any, b: any) => number) | null)[];

   constructor(config?: GroupAdapterConfig) {
      super(config);
   }

   public sort(sorters?: ExtendedSorter[]): void {
      super.sort(sorters);

      // When enabled, derive a group comparer from the active record sorters so that interactive
      // column sorting also reorders the groups. A column only reorders groups at levels where its
      // field is a group key or aggregate; other levels keep their configured order. The record-level
      // value selector is ignored — the field is resolved against the group's key/aggregates/name.
      if (this.sortGroupsBySorters && this.groupings) {
         const cultureComparer = this.sortOptions ? Culture.getComparer(this.sortOptions) : undefined;
         const colSorters: ExtendedSorter[] = isNonEmptyArray(sorters)
            ? sorters.map((s) => ({ field: s.field, direction: s.direction, comparer: s.comparer }))
            : [];

         this.groupSortComparers = this.groupings.map((g) => {
            if (colSorters.length === 0) return null;
            const fields = groupFieldNames(g, this.aggregates);
            const applicable = colSorters.filter((s) => s.field && fields.has(s.field));
            return applicable.length > 0 ? buildGroupComparer(applicable, cultureComparer) : null;
         });
      }
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
         if (this.preserveOrder && this.sorter) records = this.sorter(records);
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

      // An active column sort that maps to this level's key/aggregate (when `sortGroupsBySorters` is
      // enabled) takes over; otherwise the grouping's configured comparer (or implicit key order) applies.
      const dynamicComparer = this.sortGroupsBySorters ? this.groupSortComparers?.[level] : undefined;
      const comparer = dynamicComparer ?? grouping.comparer;

      if (comparer && !this.preserveOrder) {
         results.sort(comparer);
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
         // Clone groupings to avoid mutating the original config
         this.groupings = groupings.map((g) => {
            const groupSorters: Sorter[] = [];
            const key: Record<string, Prop<any>> = {};
            const resolvedKey: Record<string, { value: Prop<any>; direction: SortDirection }> = {};

            for (const name in g.key) {
               const keyConfig = g.key[name];
               if (!keyConfig || typeof keyConfig !== "object" || !("value" in keyConfig)) {
                  resolvedKey[name] = { value: keyConfig as Prop<any>, direction: "ASC" };
               } else {
                  resolvedKey[name] = keyConfig as { value: Prop<any>; direction: SortDirection };
               }

               key[name] = resolvedKey[name].value;
               groupSorters.push({
                  field: name,
                  direction: resolvedKey[name].direction,
               });
            }

            const grouper = new Grouper(
               key,
               { ...this.aggregates, ...g.aggregates },
               (r: DataAdapterRecord<T>) => r.store.getData(),
               g.text,
            );

            const cultureComparer = this.sortOptions ? Culture.getComparer(this.sortOptions) : undefined;

            // Sort groups by an aggregate/key/name through `sortField`/`sortDirection` or a `sorters` array.
            let sortSorters: Sorter[] | null = null;
            if (isNonEmptyArray(g.sorters)) sortSorters = g.sorters!;
            else if (g.sortField) sortSorters = [{ field: g.sortField, direction: g.sortDirection ?? "ASC" }];

            // `comparer`, `sortField`/`sorters` and the implicit key order are equivalent alternatives; an
            // explicit `comparer` wins, then declarative sorters, then sorting by key in declaration order.
            const comparer =
               g.comparer ??
               (sortSorters
                  ? buildGroupComparer(sortSorters, cultureComparer)
                  : groupSorters.length > 0
                    ? getComparer(groupSorters, (x: any) => x.key, cultureComparer)
                    : null);

            return {
               ...g,
               key: resolvedKey,
               grouper,
               comparer,
            } as ResolvedGrouping;
         });
      } else {
         throw new Error("Invalid grouping provided.");
      }
   }
}

GroupAdapter.prototype.groupName = "$group";
GroupAdapter.prototype.preserveOrder = false;
GroupAdapter.prototype.sortGroupsBySorters = false;

// The set of fields a group can be sorted by at a given level: its key fields, its aggregate aliases
// and the group name. Used to decide whether an active column sort applies to that grouping level.
function groupFieldNames(grouping: ResolvedGrouping, adapterAggregates?: StructuredProp): Set<string> {
   const names = new Set<string>();
   for (const k of grouping.grouper.keys) names.add(k.name);
   const aggregates = { ...adapterAggregates, ...grouping.aggregates };
   for (const a in aggregates) names.add(a);
   names.add("name");
   names.add("$name");
   return names;
}

// Reads a sort field straight from the GroupResult — first its key fields, then its aggregates, then
// its name. Returns a plain selector so groups can be sorted without cloning the result per comparison.
function groupFieldSelector(field: string): (gr: any) => any {
   if (field === "name" || field === "$name") return (gr) => gr?.name;
   return (gr) => {
      if (gr?.key && field in gr.key) return gr.key[field];
      if (gr?.aggregates && field in gr.aggregates) return gr.aggregates[field];
      return undefined;
   };
}

// Builds a group comparer from a list of sorters. Each sorter resolves by its explicit `value`
// selector, or by `field` looked up against the group's key/aggregates/name.
function buildGroupComparer(
   sorters: ExtendedSorter[],
   cultureComparer?: (a: any, b: any) => number,
): (a: any, b: any) => number {
   return getComparer(
      sorters.map((s) => (isDefined(s.value) || !s.field ? s : { ...s, value: groupFieldSelector(s.field) })),
      undefined,
      cultureComparer,
   );
}

function serializeKey(data: any): string {
   if (isDataRecord(data)) {
      return Object.keys(data)
         .map((k) => serializeKey(data[k]))
         .join(":");
   }
   return data?.toString() ?? "";
}
