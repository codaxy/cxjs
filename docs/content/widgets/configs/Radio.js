import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    placeholder: false,
    icon: false,
    showClear: false,
    hideClear: false,
    value: {
        key: true,
        alias: 'selection',
        type: 'number/string/boolean',
        important: true,
        description: <cx><Md>
            Selected value. If the value is equal to `option`, the radio button appears checked.
        </Md></cx>
    },
    option: {
        key: true,
        type: 'number/string/boolean',
        important: true,
        description: <cx><Md>
            Value to be written into `value` if radio button is clicked.
        </Md></cx>
    },
    native: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Use native radio HTML element (`&lt;input type="radio"/&gt;`).
            Default is `false`. Native radio buttons are difficult to style.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `radio`.
        </Md></cx>
    }
};