import {Md} from 'docs/components/Md';

import widget from '../../widgets/configs/Widget';

export default {
   ...widget,

   names: {
      type: 'array',
      key: true,
      description: <cx><Md>
         A precomputed array of names to be registered. Useful if color registrations do not come in the same order
          in different render cycles.
      </Md></cx>
   }
};
