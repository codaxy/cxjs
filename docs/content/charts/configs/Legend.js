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
            Specifies the shape of the symbol in the legend entries. By default, the shape of the series in the chart is used. `circle`, `square`, `triangle`, etc.
        </Md></cx>
    },


   entryStyle: {
        type: 'string/object',
        description: <cx><Md>
            Additional CSS styles to be applied to the legend entry elements
        </Md></cx>
    },


   entryClass: {
        type: 'string/object',
        description: <cx><Md>
            Additional CSS classes to be applied to the legend entry elements.
        </Md></cx>
    },

    valueStyle: {
        type: 'string/object',
        description: <cx><Md>
            Additional CSS styles to be applied to the legend entry values.
        </Md></cx>
    },


    valueClass: {
        type: 'string/object',
        description: <cx><Md>
            Additional CSS classes to be applied to the legend entry values.
        </Md></cx>
    },


   showValues: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Whether to show values in the legend. Default is `false`.
        </Md></cx>
   },

    valueFormat: {
        type: 'string',
        description: <cx><Md>
            Format string for the legend entry values. Default is `s`.
        </Md></cx>
    },
};
