import {Md} from '../../../components/Md';

export default {
    type: {
        type: 'string',
        description: <cx><Md>
            Type of the event.
        </Md></cx>
    },
    event: {
        type: 'Event',
        description: <cx><Md>
            Mouse or touch event associated with the operation.
        </Md></cx>
    },
    source: {
        type: 'object',
        description: <cx><Md>
            Information about the source.

            * width - source width
            * height - source height
            * margin - an array of strings containing top, right, bottom and left margin
            * data - source data
            * store - source data store
        </Md></cx>
    },
    cursor: {
        type: 'object',
        description: <cx><Md>
            Cursor position containing `clientX` and `clientY` coordinates.
        </Md></cx>
    },
    result: {
        type: 'any',
        description: <cx><Md>
            Result returned from the onDrop method. This is available only
            in onDragEnd events. If no drop occurred, the value will be `false`.
        </Md></cx>
    }
};
