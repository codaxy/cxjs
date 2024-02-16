import { Md } from '../../../components/Md';

export default {
    widget: {
        key: true,
        type: 'any',
        description: <cx><Md>
            A widget that we want to render.
        </Md></cx>
    },
    store: {
        key: true,
        type: 'object',
        description: <cx><Md>
            A `Store` object.
        </Md></cx>
    },
    instance: {
        key: true,
        type: 'Instance',
        description: <cx><Md>
            Instance of the widget.
        </Md></cx>
    },
    parentInstance: {
        key: true,
        type: 'Instance',
        description: <cx><Md>
            Instance of the parent.
        </Md></cx>
    },
    subscribe: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Enable store update subscription by setting to `true`.
        </Md></cx>
    },
    immediate: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to enable batching of updates.
        </Md></cx>
    },
    deferredUntilIdle: {
        type: 'boolean',
        description: <cx><Md>
            Improves performance by deferring the render until the browser is idle.
        </Md></cx>
    },
    idleTimeout: {
        type: 'number',
        description: <cx><Md>
            Time limit in milliseconds a browser can defer the render for.
        </Md></cx>
    },
    options: {
        key: true,
        type: 'any',
        description: <cx><Md>
            An object that defines additional options for the `Cx` component.
        </Md></cx>
    },
    onError: {
        type: 'function',
        description: <cx><Md>
            A callback function used to define actions when an error ocurrs. Takes
            `error`, `instance`, and `info` as arguments.
        </Md></cx>
    },
};