import {Md} from '../../../components/Md';
import picker from './MonthPicker';
import field from './Field';

export default {
    ...picker,
    ...field,
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied on the field. Defaults to `monthfield`.
        </Md></cx>
    },
    emptyValue: {
        type: 'any',
        description: <cx><Md>
            Value to be written in the store when the field is empty. Default value is `null`;
        </Md></cx>
    }
};