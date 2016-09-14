import {Md} from '../../../components/Md';

import widget from './Widget';
import classAndStyle from './classAndStyle';

export default {
   ...widget,
   ...classAndStyle,
   records: {
      type: 'array',
      key: true,
      description: <cx><Md>
         An array of records to be displayed in the list.
      </Md></cx>
   },
   sorters: {
      type: 'array',
      key: true,
      description: <cx><Md>
         Used for sorting the list.
      </Md></cx>
   },
   selection: {
      type: 'config',
      key: true,
      description: <cx><Md>
         Selection configuration. See [Selections](~/concepts/selections) for more details.
      </Md></cx>
   }
};
