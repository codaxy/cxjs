import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    value: {
        key: true,
        type: 'number/string',
        description: <cx><Md>
            Selected value.
        </Md></cx>
    },
    convertValues: {
        type: 'boolean',
        description: <cx><Md>
            Convert values before selection. Useful for converting strings into numbers. Default is `true`.
        </Md></cx>
    },
    nullString: {
        type: 'string',
        description: <cx><Md>
            String values representing the `null` value. Default is empty string.
        </Md></cx>
    },
    readOnly: false,
    placeholder: false,
    hideClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the clear button. Default value is `false`.
        </Md></cx>
    }
};
