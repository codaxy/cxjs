import {Md} from '../../../components/Md';
import field from './Field';

export default {
   ...field,
   value: {
      key: true,
      type: 'number/string/boolean',
      important: true,
      description: <cx><Md>
         Selected value. If the value is equal to `option`, the radio button appears checked.
      </Md></cx>
   },
   selection: {
      key: true,
      type: 'number/string/boolean',
      important: true,
      description: <cx><Md>
         Same as `value`.
      </Md></cx>
   },
   option: {
      key: true,
      type: 'number/string/boolean',
      important: true,
      description: <cx><Md>
         Value to be written into `value` if radio button is clicked.
      </Md></cx>
   },
   baseClass: {
      type: 'string',
      description: <cx><Md>
         Base CSS class to be applied on the field. Defaults to `radio`.
      </Md></cx>
   },
   placeholder: false
};