import {Md} from 'docs/components/Md';

import boundedObject from '../../svg/configs/BoundedObject';

export default {
   ...boundedObject,
   angle: {
      key: true,
      type: 'number',
      description: <cx><Md>
         Angle in degrees. Default is `360` which represents the full circle.
      </Md></cx>
   },
   class: false,
   style: false,
   preserveWhitespace: false,
   trimWhitespace: false,
   plainText: false
};
