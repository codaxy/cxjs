import { AugmentedViewBase } from "../data/AugmentedViewBase";

interface Record {
   [prop: string]: any;
}

export interface StructuredDataAccessor {
   getSelector(): (data: object) => object;
   get(): object;
   setItem(key: string, value: any): boolean;
   containsKey(key: string): boolean;
   getKeys(): string[];
}

export class NestedDataView extends AugmentedViewBase {
   nestedData?: StructuredDataAccessor;

   protected embedAugmentData(result: Record, parentStoreData: Record): void {
      if (this.nestedData) {
         let nested = this.nestedData.getSelector()(parentStoreData);
         for (let key in nested) result[key] = nested[key];
      }
   }

   protected isExtraKey(key: string): boolean {
      return this.nestedData && this.nestedData.containsKey(key);
   }

   protected setExtraKeyValue(key: string, value: any): boolean {
      return this.nestedData.setItem(key, value);
   }

   protected deleteExtraKeyValue(key: string): boolean {
      return this.setExtraKeyValue(key, undefined);
   }
}
