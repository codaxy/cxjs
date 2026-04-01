import {Md} from '../../../components/Md';
import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
    value: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Text value.
        </Md></cx>
    },
    bind: {
        type: 'string',
        description: <cx><Md>
            Store path containing the text value. Equivalent to the use of `value-bind`.
        </Md></cx>
    },
    tpl: {
        type: 'string',
        description: <cx><Md>
            Template string. Equivalent to the use of `value-tpl`.
        </Md></cx>
    },
    expr: {
        type: 'string',
        description: <cx><Md>
            Expression string. Equivalent to the use of `value-expr`.
        </Md></cx>
    },
};
