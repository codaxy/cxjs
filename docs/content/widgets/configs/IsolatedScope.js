import {Md} from '../../../components/Md';

import pureContainer from './PureContainer';

export default {
    ...pureContainer,
    bind: {
        key: true,
        type: 'string|array',
        description: <cx><Md>
            A single binding path or a list of paths to be monitored for changes.
            Use `bind` as a shorthand for defining the `data` object.
        </Md></cx>
    },
    data: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Data object selector. The children will update only if `data` change.
        </Md></cx>
    }
};
