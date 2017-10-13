import {Md} from '../../../components/Md';
import classAndStyle from './classAndStyle';
import pureContainer from './PureContainer';

export default {
    ...classAndStyle,
    ...pureContainer,
    baseClass: {
        type: 'string',
        description: <cx><Md>
            Base CSS class to be applied to the element. Default value is `dropzone`.
        </Md></cx>
    },
    overStyle: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            CSS styles to be applied when drag cursor is over the drop zone..
        </Md></cx>
    },
    nearStyle: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            CSS styles to be applied when drag cursor is near the drop zone.
        </Md></cx>
    },
    farStyle: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            CSS styles to be applied when drag operations begin used to highlight drop zones.
        </Md></cx>
    },

    overClass: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            Additional CSS class to be applied when drag cursor is over the drop zone.
        </Md></cx>
    },
    nearClass: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            Additional CSS class to be applied when drag cursor is near the drop zone.
        </Md></cx>
    },
    farClass: {
        type: 'string/object',
        key: true,
        description: <cx><Md>
            Additional CSS class to be applied when drag operations begin used to highlight drop zones.
        </Md></cx>
    },

    nearDistance: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Distance in `px` used to determine if cursor is near the dropzone. If not configured, cursor is never considered near.
        </Md></cx>
    },

    inflate: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Inflate the drop zone's bounding box so it activates on cursor proximity.
            Useful for invisible drop-zones that are only a few pixels tall/wide.
        </Md></cx>
    },

    hinflate: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Inflate the drop zone's bounding box horizontally so it activates on cursor proximity.
            Useful for invisible drop-zones that are only a few pixels tall/wide.
        </Md></cx>
    },

    vinflate: {
        type: 'number',
        key: true,
        description: <cx><Md>
            Inflate the drop zone's bounding box vertically so it activates on cursor proximity.
            Useful for invisible drop-zones that are only a few pixels tall/wide.
        </Md></cx>
    },

    onDrop: {
        type: 'function',
        key: true,
        description: <cx><Md>
            A callback method invoked when dragged item is finally dropped.
            The callback takes two arguments:
            * dragDropEvent - An object containing information related to the source
            * instance
            Return value is written into dragDropEvent.result and can be passed
            to the source's onDragEnd callback.
        </Md></cx>
    },

    onDropTest: {
        type: 'function',
        key: true,
        description: <cx><Md>
            A callback method used to test if dragged item (source) is compatible
            with the drop zone.
        </Md></cx>
    },

    onDragNear: {
        type: 'function',
        description: <cx><Md>
            A callback method invoked when the dragged item gets close to the drop zone.
            See also `nearDistance`.
        </Md></cx>
    },

    onDragAway: {
        type: 'function',
        description: <cx><Md>
            A callback method invoked when the dragged item is dragged away.
        </Md></cx>
    },

    onDragOver: {
        type: 'function',
        key: true,
        description: <cx><Md>
            A callback method invoked when the dragged item is dragged over the drop zone.
            The callback is called for each `mousemove` or `touchmove` event.
        </Md></cx>
    },

    onDragEnter: {
        type: 'function',
        description: <cx><Md>
            A callback method invoked when the dragged item is dragged over the drop zone
            for the first time.
        </Md></cx>
    },

    onDragLeave: {
        type: 'function',
        description: <cx><Md>
            A callback method invoked when the dragged item leaves the drop zone area.
        </Md></cx>
    },

    onDragStart: {
        type: 'function',
        description: <cx><Md>
            A callback method invoked when at the beginning of the drag & drop operation.
        </Md></cx>
    },

    onDragEnd: {
        type: 'function',
        description: <cx><Md>
            A callback method invoked when at the end of the drag & drop operation.
        </Md></cx>
    },


};
