import {Md} from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';
import xyAxis from './xyAxis';
import noChildren from '../../widgets/configs/noChildren';

export default {
    ...boundedObject,
    ...xyAxis,
    ...noChildren,
    axes: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Axis definition. Each key represent an axis, and each value hold axis configuration.
        </Md></cx>
    }
};
