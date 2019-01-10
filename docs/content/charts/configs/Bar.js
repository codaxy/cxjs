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
   },
   hiddenBase: {
      type: 'boolean',
      description: <cx><Md>
         If set to `true`, the chart can clip the base of the graph and show only the appropriate range that contains the values. Default value is `false`.
      </Md></cx>
   }
};
