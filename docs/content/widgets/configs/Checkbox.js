import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    value: {
        key: true,
        alias: 'checked',
        type: 'boolean',
        description: <cx><Md>
            Value of the checkbox. `true` makes the checkbox checked.
        </Md></cx>
    },
    native: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Use native checkbox HTML element (`&lt;input type="checkbox"/&gt;`).
            Default is `false`. Native checkboxes are difficult to style.
        </Md></cx>
    },
    indeterminate: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to instruct the widget to indicate indeterminate state (`null` or `undefined` value) with a square icon
            instead of appearing unchecked.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `checkbox`.
        </Md></cx>
    },
    placeholder: false
};