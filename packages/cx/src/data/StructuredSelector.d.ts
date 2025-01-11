import { StructuredProp, Record, Selector } from "../core";
import { View } from "./View";

interface StructuredSelectorConfig {
   props: StructuredProp;
   values: Record;
}

export class StructuredSelector {
   constructor(config: StructuredSelectorConfig);

   init(store: View);

   create(memoize: boolean = true): Selector<Record>;

   createStoreSelector(): (store: View) => Record;
}
