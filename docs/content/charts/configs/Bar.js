import {Md} from 'docs/components/Md';

import columnBarBase from './ColumnBarBase';

export default {
   ...columnBarBase,

   x0: {
      type: 'number',
      key: true,
      description: <cx><Md>
         Base value. Default value is `0`.
      </Md></cx>
   }
};
