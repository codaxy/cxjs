import { Md } from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';

export default {
    ...boundedObject,
    angle: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Angle in degrees. Default is `360` which represents the full circle.
      </Md></cx>
    },
    startAngle: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Start angle in degrees. Indicates the starting point of the first stack. Default is `0`.
      </Md></cx>
    },
    clockwise: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            When set to `true`, stacks are rendered in clock wise direction.
      </Md></cx>
    },
    gap: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Value in pixels used to define the distance between the slices of the chart. When used, if not already defined, implicitely adds chart `inner radius` proportional to the gap size. Default is `0`.
      </Md></cx>
    },
    class: false,
    style: false,
    preserveWhitespace: false,
    trimWhitespace: false,
    plainText: false
};
