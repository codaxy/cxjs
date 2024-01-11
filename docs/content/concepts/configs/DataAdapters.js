import { Md } from '../../../components/Md';

const dataAdapterConfig = {
    immutable: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Indicate that the data in the parent store should **not** be mutated. Defaults to `false`.
        </Md></cx>
    },
	sealed: {
        type: 'boolean',
        description: <cx><Md>
            Indicate that the data in record stores should **not** be mutated.
        </Md></cx>
    },
    recordName: {
        type: 'string',
        description: <cx><Md>
            Alias used to expose record data. Defaults to `$record`.
        </Md></cx>
    },
	indexName: {
        type: 'string',
        description: <cx><Md>
            Alias used to expose record index. Defaults to `$index`.
        </Md></cx>
    }
};

export const arrayAdapterConfig = {
    ...dataAdapterConfig,
	recordsBinding: {
        type: 'string',
        description: <cx><Md>
            Specifies the location for storing records.
        </Md></cx>
    },
	recordsAccessor: {
        type: 'object',
        description: <cx><Md>
            Configuration for accessing and modifying records data.
        </Md></cx>
    },
	keyField: {
        type: 'string',
        description: <cx><Md>
            Configures which field forms the record key.
        </Md></cx>
    }
};

export const groupAdapterConfig = {
    ...arrayAdapterConfig,
    aggregates: {
        type: 'record',
        description: <cx><Md>
            Defines computed values based on grouped records, e.g. count of elements in a group.
        </Md></cx>
    },
	groupRecordsAlias: {
        type: 'string',
        description: <cx><Md>
            Alias used to expose group records data outside the group.
        </Md></cx>
    },
	groupRecordsName: {
        type: 'string',
        description: <cx><Md>
            Alias used to expose records data within a group. Defaults to `$records`.
        </Md></cx>
    },
	groupings: {
        type: 'object',
        description: <cx><Md>
            Configures criteria for hierarchically grouping records. Allows configuring header and footer.
        </Md></cx>
    },
	groupName: {
        type: 'string',
        description: <cx><Md>
            Alias used to expose group data. Defaults to `$group`.
        </Md></cx>
    },
	sortOptions: {
        type: 'record',
        description: <cx><Md>
            Options for data sorting. See [Intl.Collator options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) for more info.
        </Md></cx>
    }
};

export const treeAdapterConfig = {
    ...arrayAdapterConfig,
	childrenField: {
        type: 'string',
        description: <cx><Md>
            Alias used to expose children data. Default is `$children`.
        </Md></cx>
    },
	expandedField: {
        type: 'string',
        description: <cx><Md>
            Alias pointing to a boolean value indicating the record's expansion status. Defaults to `$expanded`.
        </Md></cx>
    },
	leafField: {
        type: 'string',
        description: <cx><Md>
            Alias pointing to a boolean value indicating whether the node is leaf. Defaults to `$leaf`.
        </Md></cx>
    },
	loadingField: {
        type: 'string',
        description: <cx><Md>
            Alias pointing to a boolean value indicating whether the node is currently loading its children. Defaults to `$loading`.
        </Md></cx>
    },
	loadedField: {
        type: 'string',
        description: <cx><Md>
            Alias pointing to a boolean value indicating whether the node has loaded its children. Defaults to `$loaded`.
        </Md></cx>
    },
    onLoadError: {
        type: 'boolean',
        description: <cx><Md>
            A boolean value representing whether an error ocurred while loading children data.
        </Md></cx>
    },
	foldersFirst: {
        type: 'boolean',
        description: <cx><Md>
            A boolean value indicating whether folders should be displayed before leaves. Defaults to `true`.
        </Md></cx>
    },
	isTreeAdapter: {
        type: 'boolean',
        description: <cx><Md>
            A boolean value indicating whether the data adapter being used is a tree adapter. Default is `true`.
        </Md></cx>
    },
	hideRootNodes: {
        type: 'boolean',
        description: <cx><Md>
            If `true`, root nodes will be hidden, and their children nodes will be displayed as the top-level nodes. Defaults to `false`.
        </Md></cx>
    },
	childrenAccessor: {
        type: 'object',
        description: <cx><Md>
            Configuration for accessing and modifying children data of the node.
        </Md></cx>
    },
	restoreExpandedNodesOnLoad: {
        type: 'boolean',
        description: <cx><Md>
            A boolean flag that determines whether the expanded state of the nodes should be restored when the data is loaded.
        </Md></cx>
    },
	expandedState: {
        type: 'object',
        description: <cx><Md>
            Object that stores the expanded state of the nodes.
        </Md></cx>
    }
};