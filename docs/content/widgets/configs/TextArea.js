import {Md} from '../../../components/Md';
import field from './TextField';

export default {
   ...field,
   icon: false,
   showClear: false,
   hideClear: false,
   inputType: false,
   reactOn: {
      type: 'string',
      description: <cx><Md>
         Event used to report on a new value. Defaults to `blur`. Other permitted value is `input`.
      </Md></cx>
   },
   rows: {
      key: true,
      type: 'number',
      description: <cx><Md>
         Specifies the number of visible lines.
      </Md></cx>
   },
   baseClass: {
      type: 'string',
      description: <cx><Md>
         Base CSS class to be applied to the field. Defaults to `textarea`.
      </Md></cx>
   },
   emptyValue: {
    type: 'any',
    description: <cx><Md>
        Value to be written in the store when the field is empty. Default value is `null`;
    </Md></cx>
    }
};