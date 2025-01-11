import * as Cx from "../../core";
import { Instance } from "../Instance";
import { View } from "../../data/View";
import { RenderingContext } from "../RenderingContext";

export interface DataAdapterRecord<T> {
   data: T;
   index: number;
   key: string | number;
   store: View;
   type: "data" | "group-header" | "group-footer";
}

export class DataAdapter<T = unknown> {
   getRecords(
      context?: RenderingContext,
      instance?: Instance,
      records?: T[],
      parentStore?: View,
   ): DataAdapterRecord<T>[];

   setFilter(filterFn: (data: any) => boolean): void;

   sort(sorters?: Cx.Sorter[]): void;

   /** Indicate that data in the parent store should not be mutated. */
   immutable?: boolean;

   /** Indicate that data in record stores should not be mutated. */
   sealed?: boolean;
}
