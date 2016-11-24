import {Md} from '../../../components/Md';
import container from './HtmlElement';

export default {
    ...container,
    level: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Heading level. Allowed values go from 1 to 6. Default is 2.
        </Md></cx>
    },
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class. Default is `heading`.
        </Md></cx>
    }
};
