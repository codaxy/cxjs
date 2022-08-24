import {Md} from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';

export default {
    ...boundedObject,

    distance: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Distance in pixels, for which the labels will be separated from the pie chart. Default value is 100px, but when a large number of values is rendered, it is recommended to have a larger distance.
        </Md></cx>
    },

    lineStroke: {
        key: true,
        type: 'string',
        description: <cx><Md>
           A color used to paint the line.
        </Md></cx>
     },
     lineColorIndex: {
        key: false,
        type: 'number',
        description: <cx><Md>
            Index of the color in the default color palette.
        </Md></cx>
     },
     lineStyle: {
        key: true,
        type: 'string/object',
        description: <cx><Md>
            CSS style applied to the line element.
        </Md></cx>
     },
     lineClass: {
        key: true,
        type: 'string/object',
        description: <cx><Md>
            CSS class applied to the line element.
        </Md></cx>
     }
}