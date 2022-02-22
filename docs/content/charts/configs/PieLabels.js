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
    }
}