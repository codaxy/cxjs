import {Md} from '../../../components/Md';

import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
    ...widget,
    ...classAndStyle,
    records: {
        type: 'array',
        key: true,
        description: <cx><Md>
            An array of records to be displayed in the list.
        </Md></cx>
    },
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
            Available only if `sorters` are not used.
        </Md></cx>
    },
    sortDirection: {
        type: 'string',
        key: true,
        description: <cx><Md>
            A binding used to store the sort direction. Available only if `sorters` are not used.
            Possible values are `"ASC"` and `"DESC"`. Deafults to `"ASC"`.
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
    selection: {
        type: 'config',
        key: true,
        description: <cx><Md>
            Selection configuration. See [Selections](~/concepts/selections) for more details.
        </Md></cx>
    },
    grouping: {
        type: 'config',
        key: true,
        description: <cx><Md>
            Grouping configuration. Check [the example](~/examples/list/grouping) for more information.
        </Md></cx>
    },
    scrollSelectionIntoView: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to add ensure that selected record is automatically scrolled into the view on selection change.
        </Md></cx>
    },
    itemStyle: {
        type: 'string/object',
        description: <cx><Md>
            CSS style that will be applied to all list items.
        </Md></cx>
    },
    itemClass: {
        alias: 'itemClassName',
        type: 'string/object',
        description: <cx><Md>
            CSS class that will be applied to all list items.
        </Md></cx>
    },
    sortOptions: {
        type: "record",
        description: <cx><Md>
            Options for data sorting. See [Intl.Collator options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) for more info.
        </Md></cx>
    }
};
