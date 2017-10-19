import {Md} from 'docs/components/Md';

import pointReducer from './PointReducer';


export default {
    ...pointReducer,
    onInitAccumulator: false,
    onMap: false,
    onReduce: false,

    at: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Probe position.
        </Md></cx>
    },

    value: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A binding that receives a measured value.
        </Md></cx>
    },

    convert: {
        key: true,
        type: 'function',
        description: <cx><Md>
            A function used to convert x values (such as dates) into numeric format.
        </Md></cx>
    }
};
