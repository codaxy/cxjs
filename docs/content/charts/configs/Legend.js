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
            Name of the legend. Default is `legend`.
        </Md></cx>
    },

    vertical: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Switch to vertical mode.
        </Md></cx>
    },

    shape: {
        type: 'string',
        description: <cx><Md>
            Specifies the shape of the legend. By default, the shape of the series in the chart is used for the legend. `circle`, `square`, `triangle`, etc.
        </Md></cx>
    }
};
