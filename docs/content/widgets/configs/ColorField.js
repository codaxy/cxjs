import {Md} from '../../../components/Md';
import field from './Field';

export default {
      ...field,
      value: {
        type: 'string',
        key: true,
        description: <cx><Md>
            RGBA value of the selected color.
        </Md></cx>
    },
      
      inputType: false
};
