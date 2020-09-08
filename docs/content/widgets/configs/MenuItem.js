import {Md} from '../../../components/Md';

import classAndStyle from './classAndStyle';
import pureContainer from './PureContainer';

export default {
    ...classAndStyle,
    ...pureContainer,
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default is 'menuitem'.
        </Md></cx>
    },
    hoverFocusTimeout: {
        type: 'number',
        description: <cx><Md>
            Delay in milliseconds until a MenuItem receives hover focus. Default value is `500`.
        </Md></cx>
    },
    clickToOpen: {
        type: 'boolean',
        description: <cx><Md>
            Set to `true`, to prevent Submenus to expand on hover. Default value is `false`.
        </Md></cx>
    },
    hoverToOpen: {
        type: 'boolean',
        description: <cx><Md>
              Set to `true`, to expand Submenus on hover. Default value is `false`.
        </Md></cx>
    },
    horizontal: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` for horizontal menu items. Default value is `false`.
        </Md></cx>
    },
    arrow: {
        type: 'object',
        description: <cx><Md>
            Set to 'true' to display an arrow on the MenuItem element. Default value is 'false'.
        </Md></cx>
    },
    dropdownOptions: {
        type: 'config',
        description: <cx><Md>
            Additional configuration to be passed to the dropdown, such as `style`, `positioning`, etc.
        </Md></cx>
    },
    showCursor: {
        type: 'boolean',
        description: <cx><Md>
            Set to 'false' to hide cursor. Default value is 'true'.
        </Md></cx>
    },
    pad: {
        type: 'boolean',
        description: <cx><Md>
            Set to `false` to remove padding around the cell value. Default value is 'true'.
        </Md></cx>
    },
    placement: {
        type: 'string',
        key: true,
        description: <cx><Md>
             Defines where the MenuItem will be placed. Supported values are `up`, `right`, `down` and `left`,
            and corner values `down-left`, `down-right`, `down-left`, `down-right`. Default value is `null`.
        </Md></cx>
    },
    placementOrder: {
        type: 'string',
        description: <cx><Md>
            Set custom placement order. Default values are 'down-right down down-left up-right up up-left' 
            if the horizontal property is set to true, or 'right-down right right-up left-down left left-up' if it is false.
        </Md></cx>
    },
    autoClose: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true`, to close the MenuItem after click. Default value is `false`.
        </Md></cx>
    },
    icons: {
        type: 'boolean',
        description: <cx><Md>
            If set to `true`, menu items apply appropriate padding to accommodate the icons. Default value is `false`.
        </Md></cx>
    },
    keyboardShortcut: {
        type: 'object',
        description: <cx><Md>
          Add custom keyboard shorcuts. //TODO: Add an example
        </Md></cx>
    },
    tooltip: {
        type: 'string/object',
        description: <cx><Md>
           Tooltip configuration. For more info see [Tooltips](~/widgets/tooltips).
        </Md></cx>
    },
    openOnFocus: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `false`, to prevent dropdown to expand on focus. Default value is `true`.
        </Md></cx>
    },
};
