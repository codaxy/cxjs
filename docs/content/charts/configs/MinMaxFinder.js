import {Md} from 'docs/components/Md';

import pointReducer from './PointReducer';


export default {
    ...pointReducer,
    onInitAccumulator: false,
    onMap: false,
    onReduce: false,

    minX: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A binding used to receive the `x` coordinate of the graph minimum.
        </Md></cx>
    },

    minY: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A binding used to receive the `y` coordinate of the graph minimum.
        </Md></cx>
    },

    maxX: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A binding used to receive the `x` coordinate of the graph maximum.
        </Md></cx>
    },

    maxY: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A binding used to receive the `y` coordinate of the graph maximum.
        </Md></cx>
    },

    minRecord: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A binding used to receive point data of the graph minimum.
        </Md></cx>
    },

    maxRecord: {
        key: true,
        type: 'number',
        description: <cx><Md>
            A binding used to receive point data of the graph maximum.
        </Md></cx>
    }
};
