import {Md} from '../../../components/Md';

import pureContainer from './PureContainer';
import classAndStyle from './classAndStyle';

export default {
    ...pureContainer,
    ...classAndStyle,
    resizable: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to enable resizing.
        </Md></cx>
    },
    draggable: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to enable dragging the overlay.
        </Md></cx>
    },
    center: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to initially place the overlay in the center of the page.
        </Md></cx>
    },
    animate: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to append the set `animate` state after the initial render. Appended CSS class may be used to
            add show/hide animations.
        </Md></cx>
    },
    modal: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to add a modal backdrop which masks mouse events for the rest of the page.
        </Md></cx>
    },
    backdrop: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to add a modal backdrop which will dismiss the window when clicked.
        </Md></cx>
    },
    destroyDelay: {
        key: false,
        type: 'number',
        description: <cx><Md>
            Number of milliseconds to wait, before removing the element from the DOM. Used in combination with the `animate`
            property.
        </Md></cx>
    },
    inline: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to force the element to be rendered inline, instead of being appended to the body element.
            Inline overlays have z-index set to a very high value, to ensure they are displayed on top of the other content.
        </Md></cx>
    },
    baseClass: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `overlay`.
        </Md></cx>
    },
    containerStyle: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Style to be applied to the overlay's container element.
        </Md></cx>
    },

    dismissOnPopState: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to dismiss the window if the user presses the back button in the browser.
        </Md></cx>
    }
};
