import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    readOnly: false,
    placeholder: false,
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
    showClear: {
        type: 'string',
        description: <cx><Md>
            Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property.
            Default value is `true`. Note, the `placeholder` needs to be specified for the clear button to render.
        </Md></cx>
    },
    hideClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property.
            Default value is `false`. Note, the `placeholder` needs to be specified for the clear button to render.
        </Md></cx>
    }
};
