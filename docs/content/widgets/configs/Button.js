import {Md} from '../../../components/Md';
import container from './HtmlElement';

export default {
    ...container,
    disabled: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to disable the button.
        </Md></cx>
    },
    tag: {
        type: 'string',
        description: <cx><Md>
            HTML tag to be used. Default is `button`.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied on the element. Default is 'button'.
        </Md></cx>
    },
    mod: {
        type: 'string/array',
        description: <cx><Md>
            Appearance modifier. Cx ships with `primary` and `danger` mods.
        </Md></cx>
    },
    pressed: {
        key: true,
        type: 'boolean',
        description: <cx>
            <Md>
                If `true` button appears in pressed state. Useful for implementing
                toggle buttons.
            </Md>
        </cx>

    },
    confirm: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            Confirmation text or configuration object. See [MsgBox.yesNo](~/widgets/msg-boxes) for more details.
        </Md></cx>
    },
    focusOnMouseDown: {
        type: 'boolean',
        key: false,
        description: <cx><Md>
            Determines if button should receive focus on `mousedown` event. Default is `false`, which
            means that focus can be set only using the keyboard `Tab` key.
        </Md></cx>
    },
};
