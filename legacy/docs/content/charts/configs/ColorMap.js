import {Md} from 'docs/components/Md';

import widget from '../../widgets/configs/Widget';

export default {
    ...widget,

    names: {
        type: 'array',
        key: true,
        description: <cx><Md>
            A precomputed array of names to be registered. Useful if color registrations do not come in the same order
            in different render cycles.
        </Md></cx>
    },

    offset: {
        type: 'number',
        key: true,
        description: <cx><Md>
            The index of the first color. Default value is `0`.
        </Md></cx>
    },

    step: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Distance between two subsequent series colors. If `step` is not set the map will calculate it based on the number of data series.
        </Md></cx>
    },

    size: {
        type: 'number',
        key: true,
        description: <cx><Md>
            The total number of colors in a palette. Default value is `16`.
        </Md></cx>
    }
};
