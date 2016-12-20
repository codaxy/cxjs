import {Md} from '../../../components/Md';
import picker from './MonthPicker';

export default {
    ...picker,
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied on the field. Defaults to `monthfield`.
        </Md></cx>
    },
    hideClear: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to hide the clear button. Default value is `false`.
        </Md></cx>
    }
};