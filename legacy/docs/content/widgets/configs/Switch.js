import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    icon: false,
    showClear: false,
    hideClear: false,
    autoFocus: false,
    on: {
        key: true,
        alias: 'value',
        type: 'boolean',
        description: <cx><Md>
            Value indicating that switch is on.
        </Md></cx>
    },
    off: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Value indicating that switch is off.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `switch`.
        </Md></cx>
    },
    handleStyle: {
        type: 'string/object',
        description: <cx><Md>
            Style object to be applied on the switch handle.
        </Md></cx>
    },
    rangeStyle: {
        type: 'string/object',
        description: <cx><Md>
            Style object to be applied on the axis range when the switch is on.
        </Md></cx>
    },
    text: {
        type: 'string',
        description: <cx><Md>
            Text description.
        </Md></cx>
    }
};