import {Md} from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';
import legendary from './legendary';
import xyAxis from './xyAxis';

export default {
    ...boundedObject,
    ...legendary,
    ...xyAxis,

    x1: {
        key: true,
        type: 'number',
        description: <cx><Md>
            The `x1` value binding or expression.
        </Md></cx>
    },

    x2: {
        key: true,
        type: 'number',
        description: <cx><Md>
            The `x2` value binding or expression.
        </Md></cx>
    },

    y1: {
        key: true,
        type: 'number',
        description: <cx><Md>
            The `y1` value binding or expression.
        </Md></cx>
    },

    y2: {
        key: true,
        type: 'number',
        description: <cx><Md>
            The `y2` value binding or expression.
        </Md></cx>
    },

    hidden: {
        type: 'boolean',
        description: <cx><Md>
            Set to true to skip rendering of visual elements and only render children instead.
        </Md></cx>
    },

    draggable: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the range draggable along the X and Y axis.
        </Md></cx>
    },

    draggableX: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the range draggable along the X axis.
        </Md></cx>
    },

    draggableY: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the range draggable along the Y axis.
        </Md></cx>
    },

    constrain: {
        type: 'boolean',
        description: <cx><Md>
            Setting `constrain` to `true` is equivalent to setting both `constrainX` and `constrainY` to `true`.
        </Md></cx>
    },

    constrainX: {
        type: 'boolean',
        description: <cx><Md>
            Constrain the range position during drag operations to min/max values of the X axis.
        </Md></cx>
    },

    constrainY: {
        type: 'boolean',
        description: <cx><Md>
            Constrain the range position during drag operations to min/max values of the Y axis.
        </Md></cx>
    }
};
