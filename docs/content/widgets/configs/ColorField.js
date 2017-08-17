import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    icon: false,
    inputType: false,
    value: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Either `rgba`, `hsla` or `hex` value of the selected color.
             </Md></cx>
    },
    format: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Format of the color representation. Either `rgba`, `hsla` or `hex`.
            </Md></cx>
    },
    showClear: {
        type: 'string',
        description: <cx><Md>
            Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property.
            Default value is `false`.
        </Md></cx>
    },
    alwaysShowClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to display the clear button even if `required` is set. Default value is `false`.
        </Md></cx>
    },
    hideClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property.
            Default value is `true`.
        </Md></cx>
    },
};
