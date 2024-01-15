import { ArrayAdapter } from './ArrayAdapter';
import { AccessorChain, Prop, CollatorOptions, StructuredProp } from "../../core";
import { Accessor } from "../../data/getAccessor";

interface GroupAdapterConfig {
    immutable?: boolean;
    sealed?: boolean;
    recordsBinding?: Prop<any[]>;
    recordsAccessor?: Accessor;
    recordName: string | AccessorChain<any>;
    indexName: string | AccessorChain<any>;
    keyField?: string;
    aggregates?: StructuredProp;
    groupRecordsAlias?: string;
    groupRecordsName?: string;
    groupings?: any[] | null;
    groupName?: string;
    sortOptions?: CollatorOptions;
}

export class GroupAdapter extends ArrayAdapter {
    constructor(config: GroupAdapterConfig);
}
