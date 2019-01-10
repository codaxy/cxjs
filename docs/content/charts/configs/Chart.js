import {Md} from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';

export default {
   ...boundedObject,
   axes: {
      key: true,
      type: 'object',
      description: <cx><Md>
         Axis definition. Each key represent an axis, and each value hold axis configuration.
      </Md></cx>
   },
   class: false,
   style: false
};
