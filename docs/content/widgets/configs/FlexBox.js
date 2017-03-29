import {Md} from '../../../components/Md';
import container from './PureContainer';

export default {
    ...container,
    pad: {
        type: 'string/boolean',
        key: true,
        description: <cx><Md>
            Add padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
            Value `true` is equivalent to `medium`.
        </Md></cx>
    },

    hpad: {
        type: 'string/boolean',
        key: true,
        description: <cx><Md>
            Add horizontal padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
            Value `true` is equivalent to `medium`.
        </Md></cx>
    },

    vpad: {
        type: 'string/boolean',
        key: true,
        description: <cx><Md>
            Add vertical padding to the box. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
            Value `true` is equivalent to `medium`.
        </Md></cx>
    },

    direction: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Flex direction. Default is `row`. Other permitted values are `column`, `column-reverse` and `row-reverse`.
        </Md></cx>
    },

    spacing: {
        type: 'string/boolean',
        key: true,
        description: <cx><Md>
            Add spacing between items by applying a margin to children. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
            Value `true` is equivalent to `medium`.
        </Md></cx>
    },

    hspacing: {
        type: 'string/boolean',
        key: true,
        description: <cx><Md>
            Add horizontal spacing between items by applying a margin to children. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
            Value `true` is equivalent to `medium`.
        </Md></cx>
    },

    vspacing: {
        type: 'string/boolean',
        key: true,
        description: <cx><Md>
            Add vertical spacing between items by applying a margin to children. Allowed values are `xsmall`, `small`, `medium`, `large` and `xlarge`.
            Value `true` is equivalent to `medium`.
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
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to allow overflow content to wrap.
        </Md></cx>
    },

    target: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Indicate target screen size. If screen size is too small, flexbox breaks and each item takes a full row.
            Supported values are `any`, `tablet` and `desktop`. Default is `any`.
        </Md></cx>
    },

    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class. Default is `flexbox`.
        </Md></cx>
    }
};
