import {Md} from 'docs/components/Md';

import pureContainer from '../../widgets/configs/PureContainer';
import classAndStyle from '../../widgets/configs/classAndStyle';
import legendary from './legendary';
import stackable from './stackable';
import xyAxis from './xyAxis';

export default {
    ...pureContainer,
    ...classAndStyle,
    ...legendary,
    ...stackable,
    ...xyAxis,


    x: {
        key: true,
        type: 'string/number',
        description: <cx><Md>
            The `x` value binding or expression.
        </Md></cx>
    },

    y: {
        key: true,
        type: 'string/number',
        description: <cx><Md>
            The `y` value binding or expression.
        </Md></cx>
    },

    size: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Size (width) of the column in axis units.
        </Md></cx>
    },

    offset: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Of center offset of the column. Use this in combination with `size` to align multiple series on the same
            chart.
        </Md></cx>
    },

    autoSize: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to true to auto calculate size and offset. Available only if the x axis is a category axis.
        </Md></cx>
    },

    tooltip: {
        type: 'string/object',
        description: <cx><Md>
            Tooltip configuration. For more info see [Tooltips](~/widgets/tooltips).
        </Md></cx>
    }
};
