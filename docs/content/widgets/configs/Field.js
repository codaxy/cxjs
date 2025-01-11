import {Md} from '../../../components/Md';
import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
    ...widget,
    ...classAndStyle,

    disabled: {
        type: 'boolean',
        description: <cx><Md>
            Defaults to `false`. Set to `true` to disable the field.
        </Md></cx>
    },
    readOnly: {
        type: 'boolean',
        description: <cx><Md>
            Defaults to `false`. Used to make the field read-only.
        </Md></cx>
    },
    enabled: {
        type: 'boolean',
        description: <cx><Md>
            The opposite of `disabled`.
        </Md></cx>
    },
    placeholder: {
        type: 'string',
        description: <cx><Md>
            Default text displayed when the field is empty.
        </Md></cx>
    },
    inputStyle: {
        type: 'string/object',
        description: <cx><Md>
            Style object applied to the input element. Used for setting visual elements, such as borders and
            backgrounds.
        </Md></cx>
    },
    inputClass: {
        type: 'string/object',
        description: <cx><Md>
            Additional CSS class applied to the input element. Used for setting visual elements, such as borders and
            backgrounds.
        </Md></cx>
    },
    required: {
        type: 'boolean',
        description: <cx><Md>
            Defaults to `false`. Used to make the field required.
        </Md></cx>
    },
    label: {
        type: 'string/config',
        description: <cx><Md>
            Field label. For advanced use cases, see [Labels](~/widgets/labels).
        </Md></cx>
    },
    mode: {
        type: 'string',
        description: <cx><Md>
            Either `view` or `edit` (default). In view mode, the field is displayed as plain text.
        </Md></cx>
    },
    tabIndex: {
        type: 'string',
        description: <cx><Md>
            Custom tab index to be set on the field.
        </Md></cx>
    },
    viewMode: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to switch into view mode. Same as `mode="view"`.
        </Md></cx>
    },
    id: {
        type: 'string',
        description: <cx><Md>
            Id to be used on rendered input.
        </Md></cx>
    },
    emptyText: {
        type: 'string',
        description: <cx><Md>
            Text to be rendered in view mode when the field is empty.
        </Md></cx>
    },
    error: {
        type: 'string',
        description: <cx><Md>
            Used for validation. If error evaluates to non-null, the field is marked in red.
        </Md></cx>
    },
    visited: {
        type: 'boolean',
        description: <cx><Md>
            Validation errors are not shown until the user visits the field. Setting this field to `true`
            will cause that validation error indicators become visible immediately.
        </Md></cx>
    },
    autoFocus: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to automatically focus the field, after it renders for the first time.
        </Md></cx>
    },
    help: {
        type: 'string/config',
        description: <cx><Md>
            Additional content to be displayed next to the field. This is commonly used
            for presenting additional information or validation errors.
        </Md></cx>
    },
    helpSpacer: {
        type: 'boolean',
        description: <cx><Md>
            Indicates that `help` should be separated from the input with a whitespace.
            Default is `true`.
        </Md></cx>
    },
    inputAttrs: {
        type: 'object',
        description: <cx><Md>{`
            Additional attributes that should be rendered on the input element.
            E.g. \`inputAttrs=\{\{ autoComplete: "off" \}\}\`.
        `}</Md></cx>
    },
    validationMode: {
        type: 'string',
        description: <cx><Md>
            Defines how to present validation errors. Default mode is `tooltip`. Other options
            are `help` and `help-block`. See [Validation Options](~/examples/form/validation-options)
            for more information.
        </Md></cx>
    },
    validationParams: {
        type: 'structure',
        description: <cx><Md>
            An structured binding for additional validation parameters. Useful if validation depends on values
            from other fields, e.g. confirm password. Calculated value is passed as the third argument to `onValidate`.
        </Md></cx>
    },
    trackFocus: {
        type: 'boolean',
        description: <cx><Md>
            If set to `true` top level element will get additional CSS class indicating that input is focused.
            Used for adding special effects on focus. Default is `false`.
        </Md></cx>
    },
    icon: {
        type: 'string/object',
        description: <cx><Md>
            Name or configuration of the icon to be put on the left side of the input.
        </Md></cx>
    },
    showClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property.
            Default value is `true`.
        </Md></cx>
    },
    hideClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property.
            Default value is `false`.
        </Md></cx>
    },
    labelPlacement: {
        type: 'string',
        description: <cx><Md>
            Set to `material` to use custom label placement instruction. Used in Material theme to implement animated labels.
        </Md></cx>
    },
    labelStyle: {
        type: 'string/object',
        description: <cx><Md>
            Additional CSS styles to be passed to the label object.
        </Md></cx>
    },
    labelClass: {
        type: 'string',
        description: <cx><Md>
            Additional CSS class to be passed to the label object.
        </Md></cx>
    },
    helpPlacement: {
        type: 'string',
        description: <cx><Md>
            Set to `material` to use custom help placement instruction. Used in Material theme to implement absolutely positioned validation messages.
        </Md></cx>
    },
    tooltip: {
        type: 'string/object',
        description: <cx><Md>
            Tooltip configuration. For more info see [Tooltips](~/widgets/tooltips).
        </Md></cx>
    },
    tabOnEnterKey: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to move focus to the next field if `Enter` key is pressed.
        </Md></cx>
    }
};
