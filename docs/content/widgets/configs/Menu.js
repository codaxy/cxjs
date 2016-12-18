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
    itemPadding: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Controls size of menu items. Supported values are `xsmall`, `small`, `medium`, `large` or `xlarge`. For horizontal menus
            default size is `small` and for vertical it's `medium`.
        </Md></cx>
    },
};
