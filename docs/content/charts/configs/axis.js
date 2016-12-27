import {Md} from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';

export default {
    ...boundedObject,
    secondary: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Used as a secondary axis. Displayed at the top/right.
        </Md></cx>
    },
    inverted: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            When set to `true`, the values are displayed in descending order.
        </Md></cx>
    },
    vertical: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` for vertical axes.
        </Md></cx>
    },
    labelOffset: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Distance between labels and the axis.
        </Md></cx>
    },
    labelRotation: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Label rotation angle in degrees.
        </Md></cx>
    },
    labelAnchor: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Label text-anchor value. Allowed values are `start`, `end` and `middle`.
            Default value is set based on the value of `vertical` and `secondary` flags.
        </Md></cx>
    },
    labelDx: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Horizontal text offset.
        </Md></cx>
    },
    labelDy: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Vertical text offset which can be used for vertical alignment.
        </Md></cx>
    },
    hidden: {
        type: 'boolean',
        description: <cx><Md>
            When set to `true`, rendering of visual elements of the axis, such as ticks and labels, is skipped, but their function is preserved.
        </Md></cx>
    },
};
