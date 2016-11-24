import {Md} from '../../../components/Md';
import container from './PureContainer';

export default {
    ...container,
    pad: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Add default padding to the box.
        </Md></cx>
    },

    direction: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Flex direction. Default is `row`. Other permitted values are `column`, 'column-reverse` and `row-reverse`.
        </Md></cx>
    },

    spacing: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Use default spacing between items.
        </Md></cx>
    },

    align: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Specifies the alignment of items. One to one mapping to CSS `align-items`. Default is `stretch`.
        </Md></cx>
    },

    justify: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Defines how space is distributed between and around flex items.
            One to one mapping with CSS `justify-content`. Default is `flex-start`.
        </Md></cx>
    },

    wrap: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Set to `true` to allow overflow content to wrap.
        </Md></cx>
    },

    target: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Indicate target screen size. If screen size is too small flexbox breaks and each item takes a full row.
            Supported values are `any`, `tablet`, `desktop`. Default is `any`.
        </Md></cx>
    },

    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class. Default is `flexbox`.
        </Md></cx>
    }
};
