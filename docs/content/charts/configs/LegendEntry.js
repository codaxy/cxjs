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

    size: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Size of the symbol. Default value is `18`.
        </Md></cx>
    },

    selected: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Indicate that entry is selected.
        </Md></cx>
    },
    rx: {
        type: 'string/number',
        description: <cx><Md>
           Applies to rectangular shapes. The horizontal corner radius of the rect. Defaults to `ry` if `ry` is specified.
        </Md></cx>
     },
     ry: {
        type: 'string/number',
        description: <cx><Md>
           Applies to rectangular shapes. The vertical corner radius of the rect. Defaults to `rx` if `rx` is specified.
        </Md></cx>
     },
};
