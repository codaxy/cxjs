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
            Style object applied to the input element. Use for setting of visual elements, such as borders and
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
            Field label. For advanced use cases see [Labels](~/widgets/labels).
        </Md></cx>
    },
    mode: {
        type: 'string',
        description: <cx><Md>
            Either `view` or `edit` (default). In view mode field displays as plain text.
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
            Used for validation. If error evaluates to non-null field is marked in red.
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
            Set to `true` to automatically focus the field after it renders for the first time.
        </Md></cx>
    }

};
