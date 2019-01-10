import {Md} from 'docs/components/Md';

import axis from './axis';


export default {
    ...axis,
    uniform: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Uniform axes provide exact size and offset for all entries, while non-uniform
            axes adapt their size and offset to the number of entries under each category.
        </Md></cx>
    },
    values: {
        key: true,
        type: 'array/object',
        description: <cx><Md>
            Values used to initialize the axis. If an object is provided, keys are used for values and
            values are used for names.
        </Md></cx>
    },
    names: {
        key: true,
        type: 'array/object',
        description: <cx><Md>
            Names corresponding the given `values`. For example, values may be 0 .. 11 and names could be Jan .. Dec.
        </Md></cx>
    },
    minSize: {
        key: true,
        type: 'integer',
        description: <cx><Md>
            Sometimes, there is not enough data and each category takes a lot of space.
            `minSize` can be used to add fake entries up to the specified number, so
            everything looks normal.
        </Md></cx>
    }
};
