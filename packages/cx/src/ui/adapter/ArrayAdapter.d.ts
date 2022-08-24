import { AccessorChain, Prop } from "../../core";
import { Accessor } from "../../data/getAccessor";
import { DataAdapter } from "./DataAdapter";

interface ArrayAdapterConfig {
   immutable?: boolean;
   sealed?: boolean;
   recordsBinding?: Prop<any[]>;
   recordsAccessor?: Accessor;
   recordName: string | AccessorChain<any>;
   indexName: string | AccessorChain<any>;
   keyField?: string;
}

export class ArrayAdapter extends DataAdapter {
   constructor(config: ArrayAdapterConfig);
}
