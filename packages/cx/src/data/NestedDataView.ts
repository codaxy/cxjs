import { View, ViewConfig } from "./View";
import { AugmentedViewBase } from "../data/AugmentedViewBase";

export interface StructuredDataAccessor {
   getSelector(): (data: object) => Record<string, any>;
   get(): object;
   setItem(key: string, value: any): boolean;
   containsKey(key: string): boolean;
   getKeys(): string[];
}

export interface NestedDataViewConfig extends ViewConfig {
   nestedData?: StructuredDataAccessor;
   store: View;
}

export class NestedDataView extends AugmentedViewBase {
   declare nestedData?: StructuredDataAccessor;

   constructor(config: NestedDataViewConfig) {
      super(config);
   }

   protected embedAugmentData(result: Record<string, any>, parentStoreData: Record<string, any>): void {
      if (this.nestedData) {
         let nested = this.nestedData.getSelector()(parentStoreData);
         for (let key in nested) result[key] = nested[key];
      }
   }

   protected isExtraKey(key: string): boolean {
      return !!this.nestedData && this.nestedData.containsKey(key);
   }

   protected setExtraKeyValue(key: string, value: any): boolean {
      if (!this.nestedData) throw new Error("Internal error. This should not happen.");
      return this.nestedData.setItem(key, value);
   }

   protected deleteExtraKeyValue(key: string): boolean {
      return this.setExtraKeyValue(key, undefined);
   }
}
