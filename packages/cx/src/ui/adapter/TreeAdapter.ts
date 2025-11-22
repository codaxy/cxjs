import { Accessor, getAccessor } from "../../data/getAccessor";
import { isArray } from "../../util/isArray";
import { ArrayAdapter, ArrayAdapterConfig, RecordStoreCache } from "./ArrayAdapter";
import { DataAdapterRecord } from "./DataAdapter";
import { RenderingContext } from "../RenderingContext";
import { Instance } from "../Instance";
import { View } from "../../data/View";
import * as Cx from "../../core";

export interface TreeNode {
   $level?: number;
   $expanded?: boolean;
   $leaf?: boolean;
   $loading?: boolean;
   $loaded?: boolean;
   [key: string]: any;
}

export interface ExpandedState {
   current?: Set<string | number>;
   next: Set<string | number>;
}

export interface TreeAdapterConfig extends ArrayAdapterConfig {
   childrenField?: string;
   expandedField?: string;
   leafField?: string;
   loadingField?: string;
   loadedField?: string;
   onLoadError?: (response: any) => void;
   foldersFirst?: boolean;
   hideRootNodes?: boolean;
   restoreExpandedNodesOnLoad?: boolean;
   load?: (context: RenderingContext, instance: Instance, data: TreeNode) => Promise<any[]> | any[];
}

export class TreeAdapter<T extends TreeNode = TreeNode> extends ArrayAdapter<T> {
   declare public childrenField: string;
   declare public expandedField: string;
   declare public leafField: string;
   declare public loadingField: string;
   declare public loadedField: string;
   public onLoadError?: (response: any) => void;
   declare public foldersFirst: boolean;
   declare public hideRootNodes: boolean;
   public restoreExpandedNodesOnLoad?: boolean;
   public load?: (context: RenderingContext, instance: Instance, data: T) => Promise<any[]> | any[];

   protected childrenAccessor?: Accessor;
   protected expandedState?: ExpandedState;

   constructor(config?: TreeAdapterConfig) {
      super(config);
   }

   public init(): void {
      super.init();
      this.childrenAccessor = getAccessor({ bind: `${this.recordName}.${this.childrenField}` });

      if (this.restoreExpandedNodesOnLoad) {
         if (!this.keyField) {
            throw new Error(
               "Stateful tree adapter requires keyField property to be specified on either Grid or data adapter.",
            );
         }

         this.expandedState = {
            next: new Set(),
         };
      }
   }

   public mapRecords(
      context: RenderingContext,
      instance: Instance & Partial<RecordStoreCache>,
      data: T[],
      parentStore: View,
      recordsAccessor?: Accessor,
   ): DataAdapterRecord<T>[] {
      const nodes = super.mapRecords(context, instance, data, parentStore, recordsAccessor);
      const result: DataAdapterRecord<T>[] = [];

      if (this.restoreExpandedNodesOnLoad) {
         this.expandedState = {
            current: this.expandedState!.next,
            next: new Set(),
         };
      }

      this.processList(context, instance, 0, "", nodes, result);

      return result;
   }

   protected processList(
      context: RenderingContext,
      instance: Instance & Partial<RecordStoreCache>,
      level: number,
      parentKey: string,
      nodes: DataAdapterRecord<T>[],
      result: DataAdapterRecord<T>[],
   ): void {
      nodes.forEach((record) => {
         record.key = parentKey + record.key;
         this.processNode(context, instance, level, result, record);
      });
   }

   protected processNode(
      context: RenderingContext,
      instance: Instance & Partial<RecordStoreCache>,
      level: number,
      result: DataAdapterRecord<T>[],
      record: DataAdapterRecord<T>,
   ): void {
      const isHiddenRootNode = level === 0 && this.hideRootNodes;
      if (!isHiddenRootNode) {
         result.push(record);
      }

      const { data, store } = record;
      const dataRecord = data as any;
      dataRecord.$level = this.hideRootNodes ? level - 1 : level;

      if (!dataRecord[this.leafField]) {
         if (this.restoreExpandedNodesOnLoad && dataRecord[this.expandedField] == null) {
            dataRecord[this.expandedField] = this.expandedState!.current!.has(dataRecord[this.keyField!]);
         }

         if (dataRecord[this.expandedField] || isHiddenRootNode) {
            if (this.restoreExpandedNodesOnLoad) {
               this.expandedState!.next.add(dataRecord[this.keyField!]);
            }

            if (dataRecord[this.childrenField]) {
               const childNodes = super.mapRecords(
                  context,
                  instance,
                  dataRecord[this.childrenField],
                  store,
                  this.childrenAccessor,
               );
               this.processList(context, instance, level + 1, record.key + ":", childNodes, result);
            } else if (this.load && !dataRecord[this.loadedField] && !dataRecord[this.loadingField]) {
               store.set(`${this.recordName}.${this.loadingField}`, true);
               const response = this.load(context, instance, data);
               Promise.resolve(response)
                  .then((children) => {
                     store.set(`${this.recordName}.${this.childrenField}`, children);
                     store.set(`${this.recordName}.${this.loadedField}`, true);
                     store.set(`${this.recordName}.${this.loadingField}`, false);
                  })
                  .catch((response) => {
                     store.set(`${this.recordName}.${this.loadingField}`, false);
                     if (this.onLoadError) {
                        this.onLoadError(response);
                     }
                  });
            }
         } else {
            dataRecord[this.expandedField] = false;
         }
      }
   }

   public sort(sorters?: Cx.Sorter[]): void {
      if (this.foldersFirst) {
         if (!sorters || !isArray(sorters)) {
            sorters = [];
         }
         sorters = [{ field: this.leafField, direction: "ASC" }, ...sorters];
      }
      super.sort(sorters);
   }
}

TreeAdapter.prototype.childrenField = "$children";
TreeAdapter.prototype.expandedField = "$expanded";
TreeAdapter.prototype.leafField = "$leaf";
TreeAdapter.prototype.loadingField = "$loading";
TreeAdapter.prototype.loadedField = "$loaded";
TreeAdapter.prototype.foldersFirst = true;
TreeAdapter.prototype.isTreeAdapter = true;
TreeAdapter.prototype.hideRootNodes = false;
TreeAdapter.prototype.cacheByKeyField = false;
