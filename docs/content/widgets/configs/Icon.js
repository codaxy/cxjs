import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';
import pureContainer from './PureContainer';

export default {
   ...classAndStyle,
   name: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Name under which the icon is registered.
      </Md></cx>
   },
   baseClass: {
      type: 'string',
      description: <cx><Md>
         Base CSS class to be applied to the element. Default is `icon`.
      </Md></cx>
   }
};
