import { Md } from '../../../components/Md';

const dataAdapterConfig = {
};

export const arrayAdapterConfig = {
	immutable: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Indicate that data in the parent store should not be mutated. Default is `false`.
        </Md></cx>
    },
	sealed: {
        type: 'boolean',
        description: <cx><Md>
            Indicate that data in record stores should not be mutated.
        </Md></cx>
    },
	recordsBinding: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	recordsAccessor: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	recordName: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	indexName: {
        type: 'boolean',
        description: <cx><Md>
            Default is `$index`.
        </Md></cx>
    },
	keyField: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    }
};

export const groupAdapterConfig = {
	groupRecordsAlias: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	groupRecordsName: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	groupings: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	groupName: {
        type: 'boolean',
        description: <cx><Md>
            Default is `$group`.
        </Md></cx>
    },
	sortOptions: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    }
};

export const treeAdapterConfig = {
	childrenField: {
        type: 'boolean',
        description: <cx><Md>
            Default is `$childrenField`.
        </Md></cx>
    },
	expandedField: {
        type: 'boolean',
        description: <cx><Md>
            Default is `$expanded`.
        </Md></cx>
    },
	leafField: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	loadingField: {
        type: 'boolean',
        description: <cx><Md>
            Default is `$loading`.
        </Md></cx>
    },
	loadedField: {
        type: 'boolean',
        description: <cx><Md>
            Default is `$loaded`.
        </Md></cx>
    },
	foldersFirst: {
        type: 'boolean',
        description: <cx><Md>
            Default is `true`.
        </Md></cx>
    },
	isTreeAdapter: {
        type: 'boolean',
        description: <cx><Md>
            Default is `true`.
        </Md></cx>
    },
	hideRootNodes: {
        type: 'boolean',
        description: <cx><Md>
            Default is `false`.
        </Md></cx>
    },
	childrenAccessor: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	restoreExpandedNodesOnLoad: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    },
	expandedState: {
        type: 'boolean',
        description: <cx><Md>
            test
        </Md></cx>
    }
};