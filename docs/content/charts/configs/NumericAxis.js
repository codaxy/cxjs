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
    },

    deadZone: {
        type: 'number',
        description: <cx><Md>
            Size of a zone reserved for labels for both lower and upper end of the axis.
        </Md></cx>
    },

    upperDeadZone: {
        type: 'number',
        description: <cx><Md>
            Size of a zone reserved for labels near the upper (higher) end of the axis.
        </Md></cx>
    },

    lowerDeadZone: {
        type: 'number',
        description: <cx><Md>
            Size of a zone reserved for labels near the lower end of the axis.
        </Md></cx>
    },

    minLabelTickSize: {
        type: 'number',
        description: <cx><Md>
            Specifies minimum value increment between labels. Useful when formatting is not flexible enough, i.e. set to 1 for integer axes to avoid duplicate labels.
        </Md></cx>
    }
};
