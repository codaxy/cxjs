import {Md} from '../../../components/Md';

import pureContainer from './PureContainer';

export default {
    ...pureContainer,
    params: {
        key: true,
        type: 'value/object',
        description: <cx><Md>
            Parameter binding. If `params` change, the content is recreated.
        </Md></cx>
    },
    onResolve: {
        key: true,
        type: 'callback',
        description: <cx><Md>
            Callback function taking `params` and returning a widget configuration or a promise.
        </Md></cx>
    },
    mode: {
        type: 'string',
        description: <cx><Md>
            One of `replace`, `prepend` or `append`. Determines how resolved content is combined with the
            content provided as children. Default is `replace`.
        </Md></cx>
    },
    loading: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Writable loading indicator binding. Used only if `onResolve` returns a promise.
            The provided binding is set to `true` while loading is in progress.
            After the promise is resolved, the binding is set to `false`.
        </Md></cx>
    }
};
