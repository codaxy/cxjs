import {Md} from '../../../components/Md';
import field from './TextField';

export default {
   ...field,
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
   inputType: false
};