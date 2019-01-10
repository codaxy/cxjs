import {Md} from '../../../components/Md';

import pureContainer from './PureContainer';

export default {
   ...pureContainer,
   label: {
      key: true,
      type: 'string/object',
      description: <cx><Md>
         The label.
      </Md></cx>
   }
};
