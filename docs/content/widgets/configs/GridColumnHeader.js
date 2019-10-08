import {Md} from '../../../components/Md';

import classAndStyle from './classAndStyle';
import pureContainer from './PureContainer';

export default {
    ...classAndStyle,
    ...pureContainer,
    text: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Header text.
        </Md></cx>
    },
    align: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Header text alignment. One of `left`, `right` or `center`.
        </Md></cx>
    },
    allowSorting: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Use to enable or disable sorting on the column. Default is `true`.
        </Md></cx>
    },
    colSpan: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Specifies the number of columns a header cell should span. Default is `1`.
        </Md></cx>
    },
    rowSpan: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Specifies the number of rows a header cell should span. Default is `1`.
        </Md></cx>
    },
    tool: {
        type: 'object',
        description: <cx><Md>
            This property is used to define a component that will be rendered inside the column header,
            which can be used for creating custom header menus for filtering or other options.
            [See example](https://fiddle.cxjs.io/?f=Gibc7IUr).
        </Md></cx>
    },
    resizable: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the column resizable.
        </Md></cx>
    },
    width: {
        type: 'number',
        description: <cx><Md>
            Binding used to store column's width after resize.
        </Md></cx>
    },
};
