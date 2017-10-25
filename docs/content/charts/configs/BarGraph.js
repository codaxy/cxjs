import {Md} from 'docs/components/Md';

import columnBarGraphBase from './ColumnBarGraphBase';

export default {
   ...columnBarGraphBase,

   x0Field: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Name of the property which holds the base value. Default value is `false`, which means x0 value is not read from the data array.
      </Md></cx>
   },
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
