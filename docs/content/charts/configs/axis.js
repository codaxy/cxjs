import { Md } from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';

export default {
    ...boundedObject,
    secondary: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Used as a secondary axis. Displayed at the top/right.
        </Md></cx>
    },
    inverted: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            When set to `true`, the values are displayed in descending order.
        </Md></cx>
    },
    vertical: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` for vertical axes.
        </Md></cx>
    },
    labelOffset: {
        key: true,
        type: 'number/string',
        description: <cx><Md>
            Distance between labels and the axis. Defaults to `10`.
        </Md></cx>
    },
    labelRotation: {
        key: true,
        type: 'number/string',
        description: <cx><Md>
            Label rotation angle in degrees.
        </Md></cx>
    },
    labelAnchor: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Label text-anchor value. Allowed values are `start`, `end` and `middle`.
            Default value is set based on the value of `vertical` and `secondary` flags.
        </Md></cx>
    },
    labelDx: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Horizontal text offset.
        </Md></cx>
    },
    labelDy: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Vertical text offset which can be used for vertical alignment.
        </Md></cx>
    },
    hidden: {
        type: 'boolean',
        description: <cx><Md>
            When set to `true`, rendering of visual elements of the axis, such as ticks and labels, is skipped, but their function is preserved.
        </Md></cx>
    },
    labelWrap: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to break long labels into multiple lines.
            Default value is `false`. Text is split at space characters. See also
            `labelMaxLineLength` and `labelLineCountDyFactor`.
        </Md></cx>
    },
    labelMaxLineLength: {
        key: true,
        type: 'number',
        description: <cx><Md>
            If `labelWrap` is on, this number is used as a measure to split labels into multiple lines.
            Default value is `10`.
        </Md></cx>
    },
    labelLineCountDyFactor: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Used for vertical adjustment of multi-line labels. Default value is `auto`
            which means that value is initialized based on axis configuration.
            Value `0` means that label will grow towards the bottom of the screen. Value `-1`
            will make labels to grow towards the top of the screen. `-0.5` will make
            labels vertically centered.
        </Md></cx>
    },
    labelLineHeight: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Used for vertical adjustment of multi-line labels. Default value is 1 which means
            that labels are stacked without any space between them. Value of 1.4 will add 40% of the label height as a space between labels.
        </Md></cx>
    },
    hideLabels: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the axis labels. Default value is `false`.
        </Md></cx>
    },
    hideTicks: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the axis ticks. Default value is `false`.
        </Md></cx>
    },
    hideLine: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the axis line. Default value is `false`.
        </Md></cx>
    },
    lineStyle: {
        type: "string/object",
        description: <cx><Md>
            Additional CSS style to be applied to the axis line.
        </Md></cx>
    },
    tickStyle: {
        type: "string/object",
        description: <cx><Md>
            Additional CSS style to be applied to the axis ticks.
        </Md></cx>
    },
    labelStyle: {
        type: "string/object",
        description: <cx><Md>
            Additional CSS style to be applied to the axis labels.
        </Md></cx>
    },
    lineClass: {
        type: "string/object",
        description: <cx><Md>
            Additional CSS class to be applied to the axis line.
        </Md></cx>
    },
    tickClass: {
        type: "string/object",
        description: <cx><Md>
            Additional CSS class to be applied to the axis ticks.
        </Md></cx>
    },
    labelClass: {
        type: "string/object",
        description: <cx><Md>
            Additional CSS class to be applied to the axis labels.
        </Md></cx>
    },
    alternateLabelOffset: {
        type: 'number/string',
        description: <cx><Md>
            Distance between the even labels and the axis.
        </Md></cx>
    },
    tickSize: {
        type: 'number/string',
        description: <cx><Md>
            Size of the axis tick line. Defaults to `3`.
        </Md></cx>
    },
    minTickDistance: {
        type: 'number/string',
        description: <cx><Md>
            The smallest distance between two ticks on the axis. Defaults to `25`.
        </Md></cx>
    },
    minLabelDistanceVertical: {
        type: 'number/string',
        description: <cx><Md>
            The smallest distance between two labels on the vertical axis. Defaults to `40`.
        </Md></cx>
    },
    minLabelDistanceHorizontal: {
        type: 'number/string',
        description: <cx><Md>
            The smallest distance between two labels on the horizontal axis. Defaults to `50`.
        </Md></cx>
    }
};
