import {Md} from '../../../components/Md';

import dropdown from './Dropdown';

export default {
    ...dropdown,

    relatedElement: false,

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
            Set to `true` to make the tooltip always visible. This is useful e.g. in product tours, when instructions
            need to be shown, even if the mouse pointer is not around.
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
            Set to `true` to make the tooltip follow the mouse movement.
        </Md></cx>
    },
    touchBehavior: {
        key: true,
        type: 'string',
        description: <cx><Md>
            This property controls how tooltips behave on touch events. Default value
            is `toggle` which means that the tooltip is shown on first tap and closed
            on the second tap. Use `ignore` to skip showing tooltips on touch events.
        </Md></cx>
    },
    baseClass: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the field. Defaults to `tooltip`.
        </Md></cx>
    },
    globalMouseTracking: {
        key: false,
        type: 'string',
        description: <cx><Md>
            Set to `true` to rely on browser's window `mousemove` event for getting mouse coordinates
            * instead of using the element that tooltip is attached to.
        </Md></cx>
    }
};
