import { Md } from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';

export default {
    ...boundedObject,
    class: false,
    style: false,
    axes: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Axis definition. Each key represent an axis, and each value hold axis configuration.
        </Md></cx>
    },
    axesOnTop: {
        type: 'object',
        description: <cx><Md>
            Set to `true` to render axes on top of the data series.
        </Md></cx>
    }
};
