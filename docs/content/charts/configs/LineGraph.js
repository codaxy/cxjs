import {Md} from 'docs/components/Md';

import classAndStyle from '../../widgets/configs/classAndStyle';
import legendary from './legendary';
import stackable from './stackable';
import xyAxis from './xyAxis';

export default {
    ...classAndStyle,
    ...legendary,
    ...stackable,
    ...xyAxis,

    data: {
        key: true,
        type: 'array',
        description: <cx><Md>
            Data for the graph. Each entry should be an object with at least two properties whose names should match the
            `xField` and `yField` values.
        </Md></cx>
    },
    xField: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Name of the property which holds the x value. Default value is `x`.
        </Md></cx>
    },
    yField: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Name of the property which holds the y value. Default value is `y`.
        </Md></cx>
    },
    y0Field: {
        type: 'string | false',
        key: true,
        description: <cx><Md>
            Name of the property which holds the y0 value. Default value is `false`, which means y0 value is not read
            from the data array.
        </Md></cx>
    },
    y0: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Base value used for area charts. Default value is `0`.
        </Md></cx>
    },
    area: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Area switch. Default value is `false`.
        </Md></cx>
    },
    line: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Line switch. By default, the line is shown. Set to `false` to hide the line and draw only the area.
        </Md></cx>
    },
    hiddenBase: {
        type: 'boolean',
        description: <cx><Md>
            If set to `true`, the chart can clip the base of the graph and show only the appropriate range that contains
            the values. Default value is `false`.
        </Md></cx>
    },
    lineStyle: {
        type: "string/object",
        description: <cx><Md>
            Additional styles to be applied to the line element.
        </Md></cx>
    },
    areaStyle: {
        type: "string/object",
        description: <cx><Md>
            Additional styles to be applied to the area below the line.
        </Md></cx>
    },
    smooth: {
        type: "boolean",
        key: true,
        description: <cx><Md>
            et to `true` to draw smoothed lines between data points using cubic Bézier curve.
            When enabled, the graph uses control points calculated from neighboring values to create smooth transitions between data points.
        </Md></cx>
    },
    smoothingRatio: {
        type: 'number',
        description: <cx><Md>
            Controls the intensity of the smoothing effect applied to Bézier curves when `smooth` is enabled.
            Accepts a number between `0` (straight lines) and `0.4` (maximum smoothing).
            Values outside this range are automatically clamped. Default value is `0.05`.
        </Md></cx>
   }
};
