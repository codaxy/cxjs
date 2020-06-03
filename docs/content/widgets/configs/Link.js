import {Md} from '../../../components/Md';

import linkButton from './LinkButton';

export default {
    ...linkButton,

    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default is 'link'.
        </Md></cx>
    }
};
