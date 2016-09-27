import {Md} from '../../../components/Md';
import field from './Field';

export default {
    ...field,
    value: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Either `rgba`, `hsla` or `hex` value of the selected color.
             </Md></cx>
    },
    format: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Format of the color representation. Either `rgba`, `hsla` or `hex`.
            </Md></cx>
    },
    inputError: {
        type: 'boolean',
        key: false,
        description: <cx><Md>
            Defaults to 'false'. Used to report an error when selecting a color.
            </Md></cx>
    },

      
      inputType: false
};
