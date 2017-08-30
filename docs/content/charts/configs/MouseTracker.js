import {Md} from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';
import xyAxis from './xyAxis';

export default {
    ...boundedObject,
    ...xyAxis,
    x: {
        key: true,
        type: 'object',
        description: <cx><Md>
            A binding used to receive a value tracked from the `x` axis.
        </Md></cx>
    },
    y: {
        key: true,
        type: 'object',
        description: <cx><Md>
            A binding used to receive a value tracked from the `y` axis.
        </Md></cx>
    }
};
