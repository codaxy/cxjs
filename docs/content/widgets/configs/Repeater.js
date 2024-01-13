import {Md} from '../../../components/Md';

export default {
    recordAlias: {
        type: 'string',
        key: true,
        alias: 'recordName',
        description: <cx><Md>
            Alias used to expose record data. Defaults to `$record`.
        </Md></cx>
    },
    indexAlias: {
        type: 'string',
        key: true,
        alias: 'indexName',
        description: <cx><Md>
            Alias used to expose record index. Defaults to `$index`.
        </Md></cx>
    },
    sortField: {
        type: 'string',
        key: true,
        description: <cx><Md>
            A binding used to store the name of the field used for sorting the collection.
            Available only if `sorters` are **not** used.
        </Md></cx>
    },
    sortDirection: {
        type: 'string',
        key: true,
        description: <cx><Md>
            A binding used to store the sort direction. Available only if `sorters` are not used.
            Possible values are `"ASC"` and `"DESC"`. Defaults to `"ASC"`.
        </Md></cx>
    },
    sorters: {
        type: 'array',
        key: true,
        description: <cx><Md>
            A binding used to store the sorting order list.
            This should be an array of objects with `field` and `direction` properties
            (equivalent to `sortField` and `sortDirection` properties).
        </Md></cx>
    },
    records: {
        type: 'array',
        key: true,
        description: <cx><Md>
            An array of records to be shown.
        </Md></cx>
    },
    sortOptions: {
        type: "record",
        description: <cx><Md>
            Options for data sorting. See [Intl.Collator options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) for more info.
        </Md></cx>
    },
    onTrackMappedRecords: {
        type: "function",
        description: <cx><Md>
            Callback function to track and retrieve displayed records.
            Accepts new records as a first argument.
            If onCreateFilter callback is defined, filtered records can be retrieved using this callback.
        </Md></cx>
    },
};
