import {Md} from '../../../components/Md';

import overlay from './Overlay';

export default {
   ...overlay,
   title: {
      key: true,
      type: 'string',
      description: <cx><Md>
         Text to be displayed in the header.
      </Md></cx>
   },
   closable: {
      key: true,
      type: 'boolean',
      description: <cx><Md>
         Controls close button visibility. Defaults to `true`.
      </Md></cx>
   },
   baseClass: {
      key: false,
         type: 'string',
         description: <cx><Md>
         Base CSS class to be applied on the field. Defaults to `window`.
      </Md></cx>
   }
};
