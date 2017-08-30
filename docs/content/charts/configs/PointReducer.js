import {Md} from 'docs/components/Md';

import pureContainer from '../../widgets/configs/PureContainer';


export default {
    ...pureContainer,
    onInitAccumulator: {
        key: true,
        type: 'function',
        description: <cx><Md>
            A callback function used to initialize the accumulator. Arguments passed are `accumulator` and `instance`.
        </Md></cx>
    },
    onMap: {
        key: true,
        type: 'object',
        description: <cx><Md>
            A callback function used to collect and map data points. Arguments passed are `accumulator`, `x`, `y`, `name`,
            `data`, `array` and `index`.
        </Md></cx>
    },
    onReduce: {
        key: true,
        type: 'object',
        description: <cx><Md>
            A callback function used to process data and write results back. Arguments passed are `accumulator` and `instance`.
        </Md></cx>
    },
};
