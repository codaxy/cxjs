import { Accessor } from '../../data/getAccessor';
import { ArrayAdapter } from './ArrayAdapter';
import { AccessorChain, Prop } from "../../core";

interface TreeAdapterConfig {
    immutable?: boolean;
    sealed?: boolean;
    recordsBinding?: Prop<any[]>;
    recordsAccessor?: Accessor;
    recordName: string | AccessorChain<any>;
    indexName: string | AccessorChain<any>;
    keyField?: string;
    childrenField?: string;
    expandedField?: string;
    leafField?: string;
    loadingField?: string;
    loadedField?: string;
    onLoadError?(response: any): any;
    foldersFirst?: boolean;
    isTreeAdapter?: boolean;
    hideRootNodes?: boolean;
    childrenAccessor?: Accessor;
    restoreExpandedNodesOnLoad?: boolean;
    expandedState?: any;
 }

export class TreeAdapter extends ArrayAdapter {
    constructor(config: TreeAdapterConfig);
}
