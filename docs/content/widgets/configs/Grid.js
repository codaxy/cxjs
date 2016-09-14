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
            A binding used to store the name of the field used for grid sorting. Available only if `sorters` are not
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
        type: 'bool',
        key: true,
        description: <cx><Md>
            Set to `true` to add a vertical scroll and a fixed header to the grid.
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
    }
};
