import {Md} from '../../../components/Md';
import container from './Overlay';

export default {
    ...container,

    resizable: false,
    draggable: false,
    center: false,
    inline: false,
    modal: false,
    backdrop: false,
    animate: false,
    outerLayout: false,

    placement: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Defines where the dropdown will be placed.
            Supported values are `top`, `right`, `bottom` and `left`, but also corner options if specified in the [`placementOrder`](#placementOrder).
        </Md></cx>
    },

    placementOrder: {
        type: 'string',
        description: <cx><Md>
            Defines available placement options. The dropdown will be pick the placement to maximize content visibility.
            Supported options are `top`, `right`, `down` and `left` and corner values
            `up-left`, `up-right`, `down-left`, `down-right`, `right-down`, `right-up`, `left-up`, `left-down`.
            Default value is `"up down right left"`.
        </Md></cx>
    },

    closeOnScrollDistance: {
        type: 'number',
        description: <cx><Md>
            The dropdown will be automatically closed if the page is scrolled a certain distance. Default value is `50`.
        </Md></cx>
    },

    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class. Default is `dropdown`.
        </Md></cx>
    },

    relatedElement: {
        type: 'DOM Element',
        key: true,
        description: <cx><Md>
            DOM element used as an anchor for determining dropdown's position.
        </Md></cx>
    }
};
