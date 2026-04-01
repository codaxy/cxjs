import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';
import widget from './Widget';

export default {
    ...widget,
    ...classAndStyle,
    page: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Currently selected page.
        </Md></cx>
    },
    pageCount: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Total number of pages.
        </Md></cx>
    },
    length: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Number of page buttons to be displayed. Default is 5.
        </Md></cx>
    },
    baseClass: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `pagination`.
        </Md></cx>
    },
};
