import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';
import pureContainer from './PureContainer';

export default {
    ...classAndStyle,
    ...pureContainer,
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default value is `dragsource`.
        </Md></cx>
    },
    data: {
        type: 'object',
        key: true,
        description: <cx><Md>
            Data about the drag source that can be used by drop zones to test if
            drag source is acceptable and to perform drop operations.
        </Md></cx>
    },
    hideOnDrag: {
        type: 'boolean',
        key: true,
        description: <cx><Md>
            Set to `true` to hide the element while being dragged.
            Use if drop zones are configured to expand in order to indicate where drop will occur.
        </Md></cx>
    },

    handled: {
        type: 'string',
        key: true,
        description: <cx><Md>
            Set to `true` to indicate that the drag source can be dragged only by using an inner DragHandle.
        </Md></cx>
    },

    onDragStart: {
        type: 'function',
        key: true,
        description: <cx><Md>
            A callback invoked when drag operation starts.
            Arguments are `event` and `instance`. If the function returns `false`,
            drag operation is canceled.
        </Md></cx>
    },

    onDragEnd: {
        type: 'function',
        key: true,
        description: <cx><Md>
            A callback invoked when drag operation completes.
            Arguments are `event` and `instance`.
        </Md></cx>
    },

    cloneClass: {
        type: 'string',
        description: <cx><Md>
            Additional CSS class to be applied to the drag clone element.
        </Md></cx>
    },

    cloneStyle: {
        type: 'string',
        description: <cx><Md>
            Additional style rules to be applied to the drag clone element.
        </Md></cx>
    },

    clone: {
        type: 'config',
        description: <cx><Md>
            Custom contents to be displayed during drag & drop operation.
        </Md></cx>
    },
};
