import { Md } from '../../../components/Md';
import container from './HtmlElement';

export default {
    ...container,
    horizontal: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` for horizontal menus.
        </Md></cx>
    },
    itemPadding: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Controls size of menu items. Supported values are `xsmall`, `small`, `medium`, `large` or `xlarge`. For horizontal menus
            default size is `small` and for vertical it's `medium`.
        </Md></cx>
    },
    hoverFocusTimeout: {
        type: 'number',
        description: <cx><Md>
            Delay in milliseconds until a Menu receives hover focus. Default value is `500`.
            Useful to set the delay before the Submenu expands.
        </Md></cx>
    },
    placement: {
        type: 'string | null',
        description: <cx><Md>
            Defines where the Menu/Submenu will be placed. Supported values are `up`, `right`, `down` and `left`,
            and corner values `down-left`, `down-right`, `down-left`, `down-right`. Default value is `null`.
        </Md></cx>
    },
    icons: {
        type: 'boolean',
        description: <cx><Md>
            If set to `true`, menu items apply appropriate padding to accommodate the icons. Default value is `false`.
        </Md></cx>
    },
    clickToOpen: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true`, to prevent Submenus to expand on hover. Default value is `false`.
        </Md></cx>
    },
    overflow: {
        key: true,
        type: 'boolean',
        description: <cx><Md>
            Set to `true` to put overflow menu items into a submenu on the right. Default value is `false`.
        </Md></cx>
    },
    overflowIcon: {
        type: 'string',
        description: <cx><Md>
            Icon to be used for the overflow menu.
        </Md></cx>
    }
};
