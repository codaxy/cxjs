import {Md} from '../../../components/Md';
import field from './Field';

export default {
   ...field,
   value: {
      key: true,
      type: 'boolean',
      description: <cx><Md>
         Value of the checkbox. `true` makes the checkbox checked.
      </Md></cx>
   },
   checked: {
      key: true,
      type: 'boolean',
      description: <cx><Md>
         Same as `value`. Use any of two.
      </Md></cx>
   },
   baseClass: {
      type: 'string',
      description: <cx><Md>
         Base CSS class to be applied on the field. Defaults to `checkbox`.
      </Md></cx>
   },
   placeholder: false
};