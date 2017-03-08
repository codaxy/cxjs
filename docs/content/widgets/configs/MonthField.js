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
    }
};