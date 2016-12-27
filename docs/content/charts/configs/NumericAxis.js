import {Md} from 'docs/components/Md';

import axis from './axis';

export default {
    ...axis,
    min: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Minimum value.
        </Md></cx>
    },
    max: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Maximum value.
        </Md></cx>
    },
    snapToTicks: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A number ranged between `0-2`. `0` means that the range is aligned with the lowest ticks.
            Default value is `1`, which means that the range is aligned with medium ticks.
            Use value `2` to align with major ticks.
        </Md></cx>
    },
    normalized: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to true to normalize the input range.
        </Md></cx>
    },
    format: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Value format. Default is `n`.
        </Md></cx>
    },

    labelDivisor: {
        type: 'number',
        description: <cx><Md>
            Number used to divide values before rendering axis labels. Default value is `1`.
        </Md></cx>
    }
};
