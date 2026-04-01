import {Md} from '../../../components/Md';

export default {
    route: {
        type: 'string',
        key: true,
        alias: 'path',
        description: <cx><Md>
            Target route, e.g. `~/user/:userId`. Use `~/` to denote the application root path and `+/` in nested routes to append to the
            parent route.
        </Md></cx>
    },
    url: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Url binding. Bind this to the global `url` variable.
        </Md></cx>
    },
    params: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Params binding. Matched route parameters will be stored inside.
        </Md></cx>
    },
    prefix: {
        type: 'boolean',
        description: <cx><Md>
            Match route even if given `route` is only a prefix of the current `url`. This is used if a route contains nested subroutes.
        </Md></cx>
    }
};
