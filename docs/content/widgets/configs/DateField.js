import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    value: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Selected date. This should be a valid date string consumable by `Date.parse` function.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
         Base CSS class to be applied to the field. Defaults to `datefield`.
        </Md></cx>
    },
    format: {
        type: 'string',
        description: <cx><Md>
            Date format used to display the selected date. See [Formatting](~/concepts/formatting) for more details.
        </Md></cx>
    },
    hideClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the clear button. Default value is `false`.
        </Md></cx>
    }
};