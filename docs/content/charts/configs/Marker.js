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
            When set to `true`, it is equivalent to setting `constrainX` and `constrainY` to true.
        </Md></cx>
    },

    constrainX: {
        type: 'boolean',
        description: <cx><Md>
            Constrain the marker position to min/max values of the X axis during drag operations.
        </Md></cx>
    },

    constrainY: {
        type: 'boolean',
        description: <cx><Md>
            Constrain the marker position to min/max values of the Y axis during drag operations.
        </Md></cx>
    },

    hidden: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the shape draggable along the X axis.
        </Md></cx>
    },
    affectsAxes:{
        key: true,
        type: 'boolean',
        description: <cx><Md>
           Used to indicate if the data should affect axis span.
        </Md></cx>
     },
     stack:{
        type: 'string',
        description: <cx><Md>
           Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`.
        </Md></cx>
     },
     stackedX:{
        type: 'boolean',
        description: <cx><Md>
           Indicate that markers should be stacked horizontally. Default value is `false`.
        </Md></cx>
     },
     stackedY:{
        type: 'boolean',
        description: <cx><Md>
           Indicate that markers should be stacked vertically. Default value is `false`.
        </Md></cx>
     },
     rx: {
        type: 'string/number',
        description: <cx><Md>
           Applies to rectangular shapes. The horizontal corner radius of the rect. Defaults to `ry` if `ry` is specified.
        </Md></cx>
     },
     ry: {
        type: 'string/number',
        description: <cx><Md>
           Applies to rectangular shapes. The vertical corner radius of the rect. Defaults to `rx` if `rx` is specified.
        </Md></cx>
     },
};
