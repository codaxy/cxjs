import {Md} from 'docs/components/Md';

import pureContainer from '../../widgets/configs/PureContainer';
import classAndStyle from '../../widgets/configs/classAndStyle';
import legendary from './legendary';
import xyAxis from './xyAxis';

export default {
    ...pureContainer,
    ...classAndStyle,
    ...legendary,
    ...xyAxis,


    x: {
        key: true,
        type: 'string/number',
        description: <cx><Md>
            The `x` value binding or expression.
        </Md></cx>
    },

    y: {
        key: true,
        type: 'string/number',
        description: <cx><Md>
            The `y` value binding or expression.
        </Md></cx>
    },

    size: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Size of the shape in pixels.
        </Md></cx>
    },

    shape: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Shape kind. `circle`, `square`, `triangle`, etc.
        </Md></cx>
    },

    draggable: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the shape draggable along the X and Y axis.
        </Md></cx>
    },

    draggableX: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the shape draggable along the X axis.
        </Md></cx>
    },

    draggableY: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the shape draggable along the Y axis.
        </Md></cx>
    },

    constrain: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to is equivalent to setting `constrainX` and `constrainY` to true.
        </Md></cx>
    },

    constrainX: {
        type: 'boolean',
        description: <cx><Md>
            Constrain the marker position during drag operations to min/max values of the X axis.
        </Md></cx>
    },

    constrainY: {
        type: 'boolean',
        description: <cx><Md>
            Constrain the marker position during drag operations to min/max values of the Y axis.
        </Md></cx>
    }
};
