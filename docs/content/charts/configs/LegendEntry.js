import {Md} from 'docs/components/Md';

import htmlElement from '../../widgets/configs/HtmlElement';
import legendary from './legendary';

export default {
    ...htmlElement,
    ...legendary,

    shape: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Shape of the symbol. `square`, `circle`, `triangle` etc.
        </Md></cx>
    },

    selected: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Indicate that entry is selected.
        </Md></cx>
    }


};
