import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    icon: false,
    showClear: false,
    hideClear: false,
    range: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to allow range select.
        </Md></cx>
    },
    from: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Start of the selected month range. This should be a valid date string consumable by `Date.parse` function.
            Used only if `range` is set to `true`.
        </Md></cx>
    },
    to: {
        key: true,
        type: 'string',
        description: <cx><Md>
            End of the selected month range. This should be a valid date string consumable by `Date.parse` function.
            Used only if `range` is set to `true`.
        </Md></cx>
    },
    value: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Selected month date. This should be a valid date string consumable by `Date.parse` function.
            Used only if `range` is set to `false` (default).
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied on the field. Defaults to `monthpicker`.
        </Md></cx>
    }
};