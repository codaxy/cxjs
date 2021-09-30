import {Md} from '../../../components/Md';

import overlay from './Overlay';

export default {
    ...overlay,
    title: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Text to be displayed in the header.
        </Md></cx>
    },
    header: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Advanced Window header as a custom Cx component. [See example](https://fiddle.cxjs.io/?f=gDdDHHI9).
        </Md></cx>
    },
    closable: {
        key: true,
        alias: 'closeable',
        type: 'boolean',
        description: <cx><Md>
            Controls the close button visibility. Defaults to `true`.
        </Md></cx>
    },
    baseClass: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `window`.
        </Md></cx>
    },
    fixed: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to disable moving the window by dragging the header.
        </Md></cx>
    },
};
