import { Md } from '../../../components/Md';

import button from './Button';

export default {
    ...button,

    disabled: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to disable the link.
        </Md></cx>
    },

    href: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Url to the link's target location. The link should start with `~/` or `#/` for pushState/hash based navigation.
            The `+/` prefix can be used to build a URL relative to the parent route.
        </Md></cx>
    },

    url: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Binding to the current url location in the store. If `href` matches `url`, additional CSS class `active` is
            applied.
        </Md></cx>
    },

    match: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Accepted values are `equal`, `prefix` and `subroute`. Default is `equal` which means that `url` must exactly match `href` in order to consider the link active.
            In `prefix` mode, if `href` is a prefix of `url`, the link is considered active. The `subroute` mode is similar to `prefix` mode, except that the `href` must be followed by a forward slash `/`, indicating
            a subroute.
        </Md></cx>
    },

    activeClass: {
        key: true,
        type: 'string/object',
        description: <cx><Md>
            Additional CSS class to be applied to the element when it's active.
        </Md></cx>
    },

    activeStyle: {
        key: true,
        type: 'string/object',
        description: <cx><Md>
            Additional CSS style to be applied to the element when it's active.
        </Md></cx>
    },

    inactiveClass: {
        key: true,
        type: 'string/object',
        description: <cx><Md>
            Additional CSS class to be applied to the element when it's not active.
        </Md></cx>
    },

    inactiveStyle: {
        key: true,
        type: 'string/object',
        description: <cx><Md>
            Additional CSS style to be applied to the element when it's not active.
        </Md></cx>
    },
};

