import { Prop, StringProp } from "../../core";
import { ArrayAdapter } from "./ArrayAdapter";

interface TreeAdapterConfig {
   immutable?: boolean;
   sealed?: boolean;
   recordsBinding?: Prop<any[]>;
   recordName?: StringProp;
   indexName?: StringProp;
   keyField?: string;
   childrenField?: string;
   expandedField?: string;
   leafField?: string;
   loadingField?: string;
   loadedField?: string;
   onLoadError?: (response: any) => void;
   foldersFirst?: boolean;
   hideRootNodes?: boolean;
   restoreExpandedNodesOnLoad?: boolean;
}

export class TreeAdapter extends ArrayAdapter {
   constructor(config: TreeAdapterConfig);
}
