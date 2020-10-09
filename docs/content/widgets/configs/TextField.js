import { Md } from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    value: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Textual value of the input.
        </Md></cx>
    },
    reactOn: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Event used to report a new value. Defaults to `input`, which means that entered value will be written to the
            store on each keystroke.
            Other permitted values are `enter` (Enter key pressed) and `blur` (field looses focus). Multiple values
            should be separated by space,
            e.g. `enter blur`.
        </Md></cx>
    },
    inputType: {
        key: true,
        type: 'string/array',
        description: <cx><Md>
            Defaults to `text`. Other permitted value is `password`.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `textfield`.
        </Md></cx>
    },
    validationRegExp: {
        type: 'RegExp',
        description: <cx><Md>
            Regular expression used to validate the user's input.
        </Md></cx>
    },
    validationErrorText: {
        type: 'RegExp',
        description: <cx><Md>
            Message to be shown to the user if validation fails.
        </Md></cx>
    },
    minLength: {
        type: 'string',
        description: <cx><Md>
            Minimal length of the input text.
        </Md></cx>
    },
    maxLength: {
        type: 'string',
        description: <cx><Md>
            Maximal length of the input text.
        </Md></cx>
    },
    maxLengthValidationErrorText: {
        type: 'string',
        description: <cx><Md>
            Message to be shown to the user if input text is too long.
        </Md></cx>
    },
    minLengthValidationErrorText: {
        type: 'string',
        description: <cx><Md>
            Message to be shown to the user if input text is too short.
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
    validationParams: {
        type: 'any',
        description: <cx><Md>
            Validation params to be passed to the `onValidate` callback.
        </Md></cx>
    },
    emptyValue: {
        type: 'any',
        description: <cx><Md>
            Value to be written in the store when the field is empty. Default value is `null`;
        </Md></cx>
    },
    focused: {
        type: 'any',
        description: <cx><Md>
            If `trackFocus` is set, this value will be set when the field recieves focus.
        </Md></cx>
    }
};