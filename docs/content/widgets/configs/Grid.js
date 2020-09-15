import { Md } from '../../../components/Md';

import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
    ...widget,
    ...classAndStyle,
    records: {
        type: 'array',
        key: true,
        description: <cx><Md>
            An array of records to be displayed in the grid.
        </Md></cx>
    },
    sorters: {
        type: 'array',
        key: true,
        description: <cx><Md>
            A binding used to store the sorting order list. Commonly used for server-side sorting.
        </Md></cx>
    },
    sortField: {
        type: 'string',
        key: true,
        description: <cx><Md>
            A binding used to store the name of the field used for sorting grids. Available only if `sorters` are not
            used.
        </Md></cx>
    },
    sortDirection: {
        type: 'string',
        key: true,
        description: <cx><Md>
            A binding used to store the sort direction. Available only if `sorters` are not used.
        </Md></cx>
    },
    scrollable: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to add a vertical scroll and a fixed header to the grid. Scrollable grids shoud have `height` or `max-height` set.
            Otherwise, the grid will grow to accomodate all rows.
        </Md></cx>
    },
    scrollSelectionIntoView: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to add ensure that selected record is automatically scrolled into the view on selection change.
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
        type: 'array',
        key: true,
        description: <cx><Md>
            An array of grouping level definitions. Check allowed grouping level properties in the section below.
        </Md></cx>
    },
    columns: {
        type: 'array',
        key: true,
        description: <cx><Md>
            An array of columns. Check column configuration options in the section below.
        </Md></cx>
    },
    lockColumnWidths: {
        type: 'boolean',
        description: <cx><Md>
            Set to true to lock column widths after the first render. This is helpful in pagination scenarios to
            maintain consistent looks across pages.
        </Md></cx>
    },
    defaultSortField: {
        type: 'string',
        key: false,
        description: <cx><Md>
            Default sort field. Used if neither `sortField` or `sorters` are set.
        </Md></cx>
    },
    defaultSortDirection: {
        type: 'string',
        key: false,
        description: <cx><Md>
            Default sort direction.
        </Md></cx>
    },
    emptyText: {
        type: 'string',
        key: false,
        description: <cx><Md>
            Text to be displayed instead of an empty table.
        </Md></cx>
    },
    border: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to add default border around the table. Automatically set if
            grid is `scrollable`.
        </Md></cx>
    },
    vlines: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to add vertical gridlines.
        </Md></cx>
    },
    headerMode: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Determines header appearance. Supported values
            are `plain` and `default`. Default mode is used if some of the columns
            are sortable. Plain mode better suits reports and other scenarios in which
            users do not interact with the grid.
        </Md></cx>
    },
    cached: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to enable row caching. This greatly improves grid performance
            on subsequent render operations, however, only changes on `records`
            are allowed. If grid rows display any data outside `records`, changes on that
            data will not be caught.
        </Md></cx>
    },

    buffered: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to render only visible rows on the screen. This greatly improves performance for grids
            with a lot of data. Works only if the grid is `scrollable`.
        </Md></cx>
    },

    bufferSize: {
        type: 'number',
        description: <cx><Md>
            Number of rendered rows in `buffered` grids. Default value is 60.
        </Md></cx>
    },

    bufferStep: {
        type: 'number',
        description: <cx><Md>
            Number of rows to be scrolled before buffer adjustment. Default value is 15.
        </Md></cx>
    },
    pageSize: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Page size used to fetch records during infinite scrolling. Default value is `100`.
        </Md></cx>
    },
    clearableSort: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            If set, clicking on the column header will loop between ASC, DESC and no sorting order, instead of ASC and DESC only.
        </Md></cx>
    },
    onRowDoubleClick: {
        type: 'function',
        description: <cx><Md>
            Callback function to be executed when a row is double-clicked.
        </Md></cx>
    },
    onRowClick: {
        type: 'function',
        description: <cx><Md>
            Callback function to be executed when a row is clicked.
        </Md></cx>
    },
    onRowContextMenu: {
        type: 'function',
        description: <cx><Md>
            Callback function to be executed when a row is right-clicked.
        </Md></cx>
    },
    remoteSort: {
        type: "boolean",
        description: <cx><Md>
            Set to `true` if sorting is done remotely, on the server-side. Default value is `false`.
        </Md></cx>
    },
    fixedFooter: {
        type: "boolean",
        description: <cx><Md>
            Set to `true` to add a fixed footer at the bottom of the grid.
        </Md></cx>
    },
    sortOptions: {
        type: "record",
        description: <cx><Md>
            Options for data sorting. See [Intl.Collator options](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Collator) for more info.
        </Md></cx>
    },
    preSorters: {
        type: 'array',
        description: <cx><Md>
            Additional sorters to be prepended to the actual list of sorters.
        </Md></cx>
    },

    scrollResetParams: {
        type: 'object',
        description: <cx><Md>
            Parameters whose change will cause the scroll to be reset.
        </Md></cx>
    },

    filterParams: {
        type: 'object',
        description: <cx><Md>
            Parameters which will be passed to the onCreateFilter callback.
        </Md></cx>
    },

    onCreateFilter: {
        type: "function",
        description: <cx><Md>
            Callback function used to create a filter. The function accepts `filterParams` as a first argument and
            it should return a predicate function used to filter the records.
        </Md></cx>
    },

    onCreateIsRecordSelectable: {
        type: "function",
        description: <cx><Md>
            Callback function used to specify which row is selectable and which not.
        </Md></cx>
    },

    hoverChannel: {
        type: 'string',
        description: <cx><Md>
            A value used to identify the group of components participating in hover effect synchronization. See [HoverSync](~/charts/hover-sync).
        </Md></cx>
    },

    rowHoverId: {
        type: 'string',
        description: <cx><Md>
            A value used to uniquely identify the record within the hover sync group. See [HoverSync](~/charts/hover-sync).
        </Md></cx>
    },

    focusable: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` or `false` to explicitly define if grid is allowed to receive focus.
        </Md></cx>
    }
};
