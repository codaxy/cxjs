import { AugmentedViewBase } from "../data/AugmentedViewBase";
import { StructuredDataAccessor } from "./StructuredDataAccessor";

interface Record {
   [prop: string]: any;
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
