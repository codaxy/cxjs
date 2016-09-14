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
    }
};
