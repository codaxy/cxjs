import {Md} from 'docs/components/Md';

import widget from '../../widgets/configs/Widget';
import classAndStyle from '../../widgets/configs/classAndStyle';

export default {
    ...widget,
    ...classAndStyle,

    name: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Name of the legend Default is `legend`.
        </Md></cx>
    },

    vertical: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Switch to vertical mode.
        </Md></cx>
    }
};
