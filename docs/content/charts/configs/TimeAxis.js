import {Md} from 'docs/components/Md';

import axis from './axis';

export default {
    ...axis,
    min: {
        key: true,
        type: 'date/string/number',
        description: <cx><Md>
            Minimum value.
        </Md></cx>
    },
    max: {
        key: true,
        type: 'date/string/number',
        description: <cx><Md>
            Maximum value.
        </Md></cx>
    },
    snapToTicks: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Number in range of `0-2`. `0` means that range is aligned with the lowest ticks.
            Default value is `1` which means range is aligned with medium ticks.
            Use value `2` to align with major ticks.
        </Md></cx>
    },
    format: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Value format. If left empty, format is selected based on the domain range.
        </Md></cx>
    }
};
