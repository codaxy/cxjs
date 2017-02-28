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
    trackFocus: {
        type: 'boolean',
        description: <cx><Md>
            If set to `true` top level element will get additional CSS class indicating that input is focused.
            Used for adding special effects on focus. Default is `false`.
        </Md></cx>
    }
};
