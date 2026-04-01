import {Md} from '../../../components/Md';
import container from './HtmlElement';

export default {
    ...container,
    asterisk: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to add red asterisk for required fields.
        </Md></cx>
    }
};
