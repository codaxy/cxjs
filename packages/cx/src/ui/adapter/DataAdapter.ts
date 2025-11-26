import { Component } from "../../util/Component";
import { Instance } from "../Instance";
import { View } from "../../data/View";
import { RenderingContext } from "../RenderingContext";
import { Sorter } from "../Prop";

export type DataAdapterRecordType = "data" | "group-header" | "group-footer";

export interface DataAdapterRecord<T = any> {
   data: T;
   index?: number;
   key: string;
   store: View;
   type?: DataAdapterRecordType;
}

export interface DataAdapterConfig {
   recordName?: string;
   indexName?: string;
   immutable?: boolean;
   sealed?: boolean;
}

export abstract class DataAdapter<T = any> extends Component {
   declare public recordName: string;
   declare public indexName: string;
   declare public immutable: boolean;
   declare public sealed?: boolean;

   declare protected filterFn?: (data: T) => boolean;

   constructor(config?: DataAdapterConfig) {
      super(config);
   }

   public abstract getRecords(
      context: RenderingContext,
      instance: Instance,
      records: T[],
      parentStore: View,
   ): DataAdapterRecord<T>[];

   public setFilter(filterFn?: (data: T) => boolean): void {
      this.filterFn = filterFn;
   }

   public sort(sorters?: Sorter[]): void {}
}

DataAdapter.prototype.recordName = "$record";
DataAdapter.prototype.indexName = "$index";
DataAdapter.prototype.immutable = false;
