import {Md} from 'docs/components/Md';

import columnBarBase from './ColumnBarBase';

export default {
   ...columnBarBase,

   y0: {
      type: 'number',
      key: true,
      description: <cx><Md>
         Column base value. Default value is `0`.
      </Md></cx>
   }
};
