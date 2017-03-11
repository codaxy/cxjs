import {Md} from 'docs/components/Md';

import boundedObject from './BoundedObject';


export default {
    ...boundedObject,
    aspectRatio: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Aspect ratio of the the SVG element. Default value is `1.618`. This value doesn't have any effect
            unless `autoWidth` or `autoHeight` is set.
        </Md></cx>
    },
    autoWidth: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to automatically calculate width based on the measured height and `aspectRatio`.
        </Md></cx>
    },
    autoHeight: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Set to `true` to automatically calculate height based on the measured width and `aspectRatio`.
        </Md></cx>
    },
};
