import {Md} from '../../../components/Md';

import isolatedScope from './IsolatedScope';

export default {
    ...isolatedScope,
    exclusive: {
        key: true,
        type: 'string|array',
        description: <cx><Md>
            A single binding path or a list of paths to be monitored for changes.
            Use `exclusive` as a shorthand for defining the `exclusiveData` object.
        </Md></cx>
    },
    exclusiveData: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Exclusive data selector. If only exclusive data change, the scope will be re-rendered without recalculating other elements on the page.
            Use in case if the scope uses both exclusive and shared data.
        </Md></cx>
    },
    name: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Name of the scope used for debugging/reporting purposes.
        </Md></cx>
    },
};
