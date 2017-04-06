import {Md} from '../../../components/Md';

import button from './Button';

export default {
    ...button,

    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default is 'uploadbutton'.
        </Md></cx>
    },

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
            Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation.
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
            Either `equal` or `prefix`. Default is `equal` which means that `url` must be exactly match `href` in order to
            consider the link active. In `prefix` mode, if `href` is a prefix of `url`, the link is considered active.
        </Md></cx>
    }
};
