import { getSelector } from "../data/getSelector";
import { StructuredDataAccessor } from "../data/NestedDataView";

export class StructuredInstanceDataAccessor implements StructuredDataAccessor {
   instance: any;
   dataConfig: any;
   useParentStore: any;
   dataSelector: any;

   constructor(config: any) {
      this.instance = config.instance;
      this.dataConfig = config.data;
      this.useParentStore = config.useParentStore;
      this.dataSelector = getSelector(config.data);
      if (this.dataSelector.memoize) this.dataSelector = this.dataSelector.memoize();
   }
   getSelector() {
      return this.dataSelector;
   }
   get() {
      return this.dataSelector.get(this.instance.store.getData());
   }
   setItem(key: string, value: any): boolean {
      return this.instance.nestedDataSet(key, value, this.dataConfig, this.useParentStore);
   }
   containsKey(key: string) {
      return this.dataConfig.hasOwnProperty(key);
   }
   getKeys() {
      return Object.keys(this.dataConfig);
   }
}
