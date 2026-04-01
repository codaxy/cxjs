import { Md } from "../../../components/Md";

export default {
    dragSource: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Drag source configuration. Define mode as `move` or `copy` and additional data.
        </Md></cx>
    },
    dropZone: {
        key: true,
        type: 'object',
        description: <cx><Md>
            Drop zone configuration. Define mode as either `preview` or `insertion`.
        </Md></cx>
    },
    allowsFileDrops: {
        type: 'boolean',
        description: <cx><Md>
            Allow grid to receive drag and drop operations containing files.
        </Md></cx>
    },
    onCreateIsRecordDraggable: {
        type: 'function',
        description: <cx><Md>
            Callback to create a function that can be used to check whether a record is draggable.
        </Md></cx>
    },
    onDrop: {
        key: true,
        type: 'function',
        description: <cx><Md>
            Function called on `drop` event. Used for data updates such as rearranging the list.
            Accepts `GridDragEvent` and `Instance` object arguments.
        </Md></cx>
    },
    onDropTest: {
        key: true,
        type: 'function',
        description: <cx><Md>
            Callback function used to check whether `drop` action is allowed. Takes
            `DragEvent` and `Instance` objects as arguments. Returns a `boolean` value.
        </Md></cx>
    },
    onDragStart: {
        type: 'function',
        description: <cx><Md>
            Function called when user starts dragging. Accepts `DragEvent` and
            `Instance` object arguments.
        </Md></cx>
    },
    onDragEnd: {
        type: 'function',
        description: <cx><Md>
            Function called when user stops dragging. Accepts `DragEvent` and
            `Instance` objects as arguments.
        </Md></cx>
    },
    onDragOver: {
        type: 'function',
        description: <cx><Md>
            Callback function called when user drags over another item. Takes
            `GridDragEvent` and `Instance` objects. Returns `void` or a `boolean`.
        </Md></cx>
    },
    onRowDropTest: {
        key: true,
        type: 'function',
        description: <cx><Md>
            Callback function used to check whether row `drop` action is allowed. Takes
            `DragEvent` and `Instance` objects as arguments. Returns a `boolean` value.
        </Md></cx>
    },
    onRowDragOver: {
        type: 'function',
        description: <cx><Md>
            Callback function called when user drags over another row. Takes
            `GridRowDragEvent` and `Instance` objects. Returns `void` or a `boolean`.
        </Md></cx>
    },
    onRowDrop: {
        key: true,
        type: 'function',
        description: <cx><Md>
            Function called on row `drop` event. Used to update data, e.g. attach a node
            to a subtree. Accepts `GridRowDragEvent` and `Instance` object arguments.
            Returns `void` or a `boolean`.
        </Md></cx>
    },
    onColumnDrop: {
        key: true,
        type: 'function',
        description: <cx><Md>
            Function called on column `drop` event. Used to update columns, e.g. rearrange
            their order. Accepts `GridColumnDropEvent` and `Instance` object arguments.
            Returns `void` or a `boolean`.
        </Md></cx>
    },
    onColumnDropTest: {
        key: true,
        type: 'function',
        description: <cx><Md>
            Callback function used to check if the dragged object contains information
            required to make a successful column drop. Takes `DragEvent` and `Instance`
            objects as arguments. Returns a `boolean` value.
        </Md></cx>
    },
}