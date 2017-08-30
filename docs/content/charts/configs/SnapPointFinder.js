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
        type: 'number',
        description: <cx><Md>
            A binding used to receive the `x` coordinate of the point nearest to the cursor.
        </Md></cx>
    },

    snapY: {
        key: true,
        type: 'number',
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
    }
};
