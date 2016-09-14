import {Md} from '../../../components/Md';
import container from './HtmlElement';

export default {
   ...container,
   horizontal: {
      type: 'boolean',
      key: true,
      description: <cx><Md>
         Set to `true` for horizontal menus.
      </Md></cx>
   },
};
