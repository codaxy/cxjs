import {Md} from '../../../components/Md';

import overlay from './Overlay';

export default {
    ...overlay,
    modal: false,
    inline: false,
    center: false,
    resizable: false,
    draggable: false,
    title: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Text to be displayed in the header.
        </Md></cx>
    },
    offset: {
        key: true,
        type: 'number',
        description: <cx><Md>
            Distance in pixels from related elements. Default is `8`.
        </Md></cx>
    },
    placement: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Placement strategy. Defaults to `right up down left`. `top` and `bottom` values are also valid and
            behave the same as `up` and `down`.
        </Md></cx>
    },
    text: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Text to be displayed inside the tooltip.
        </Md></cx>
    },
    alwaysVisible: {
        key: false,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to make the tooltip always visible. This is useful for making product tours when instructions
            need to be shown even if mouse pointer is not around.
        </Md></cx>
    },
    mouseTrap: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Tooltips are hidden as soon as the mouse leaves the related widget. Set this to `true` to keep the tooltip
            while the mouse is inside the tooltip itself.
        </Md></cx>
    },
    trackMouse: {
        key: true,
        type: 'string',
        description: <cx><Md>
            Set to `true` to make that the tooltip follows the mouse while moving.
        </Md></cx>
    }
};
