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
            Defines where the toast will be placed. Supported values are `top`, `right`, `bottom` and `left`. Default value is `top`.
        </Md></cx>
    },

    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class. Default is `toast`.
        </Md></cx>
    }
};
