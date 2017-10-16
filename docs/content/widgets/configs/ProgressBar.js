import {Md} from '../../../components/Md';
import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
    ...widget,
    ...classAndStyle,

    disabled: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Defaults to `false`. Set to `true` to make it look disabled.
        </Md></cx>
    },
    value: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Progress value, a number between `0` and `1`. Default value is `0`.
        </Md></cx>
    },
    text: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Progress bar annotation.
        </Md></cx>
    },
};
