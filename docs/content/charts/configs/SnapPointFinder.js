import {Md} from 'docs/components/Md';

import pointReducer from './PointReducer';


export default {
    ...pointReducer,
    onInitAccumulator: false,
    onMap: false,
    onReduce: false,

    cursorX: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Cursor X position. Commonly obtained by using a parent MouseTracker component.
        </Md></cx>
    },

    cursorY: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Cursor Y position. Commonly obtained by using a parent MouseTracker component.
        </Md></cx>
    },

    snapX: {
        key: true,
        type: 'string | number',
        description: <cx><Md>
            A binding used to receive the `x` coordinate of the point nearest to the cursor.
        </Md></cx>
    },

    snapY: {
        key: true,
        type: 'string | number',
        description: <cx><Md>
            A binding used to receive the `y` coordinate of the point nearest to the cursor.
        </Md></cx>
    },

    snapRecord: {
        key: true,
        type: 'record',
        description: <cx><Md>
            A binding used to receive full data of the point nearest to the cursor.
        </Md></cx>
    },

    maxDistance: {
        type: 'number',
        description: <cx><Md>
        Maximum distance between cursor and the snap point. Default value is `50`. Adjust accordingly for large distances, e.g. set to `Infinity` when using `TimeAxis`.
    </Md></cx>
    },

    convertX: {
        key: true,
        type: 'function',
        description: <cx><Md>
            A function used to convert `x` values (such as dates) into numeric format. Must be defined for proper functioning with `TimeAxis`.
        </Md></cx>
    },

    convertY: {
        key: true,
        type: 'function',
        description: <cx><Md>
            A function used to convert `y` values (such as dates) into numeric format. Must be defined for proper functioning with `TimeAxis`.
        </Md></cx>
    }
};
