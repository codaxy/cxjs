import {Md} from '../../../components/Md';

import container from './HtmlElement';

export default {
   ...container,
   tab: {
      type: 'string/number',
      key: true,
      description: <cx><Md>
         A value to be written to the `value` property if the tab is clicked. 
      </Md></cx>
   },
   value: {
      type: 'string',
      key: true,
      description: <cx><Md>
         Value of the currently selected tab. If `value` is equal to `tab`, the tab appears active.
      </Md></cx>
   },
   disabled: {
      type: 'string',
      description: <cx><Md>
         Set to `true` to disable selection.
      </Md></cx>
   }
};
