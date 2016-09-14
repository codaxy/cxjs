import {Md} from 'docs/components/Md';

import pureContainer from '../../widgets/configs/PureContainer';
import classAndStyle from '../../widgets/configs/classAndStyle';
import legendary from './legendary';
import xyAxis from './xyAxis';

export default {
   ...pureContainer,
   ...classAndStyle,
   ...legendary,
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
         Size of the shape in pixels.
      </Md></cx>
   },

   shape: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Shape kind. `circle`, `square`, `triangle`, etc.
      </Md></cx>
   }
};
