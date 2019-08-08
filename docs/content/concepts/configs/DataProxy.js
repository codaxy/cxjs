import {Md} from '../../../components/Md';
import pureContainer from '../../widgets/configs/PureContainer';

export default {
    ...pureContainer,
    
    data: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Object whose property names serve as aliases, and their values are objects with `expr` and `set` properties that define custom getter and setter logic.
        </Md></cx>
    },
    value: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Cx binding, computable, expression or an object with `expr` and/or `set` properties.
        </Md></cx>
    },
    alias: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Alias for computed value.
        </Md></cx>
    }
};