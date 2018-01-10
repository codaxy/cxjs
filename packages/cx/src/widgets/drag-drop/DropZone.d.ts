import * as Cx from '../../core';

import {Instance} from '../../ui/Instance';
import {DragEvent} from "./ops";

interface DropZoneProps extends Cx.StyledContainerProps {
   
   /** CSS styles to be applied when drag cursor is over the drop zone. */
   overStyle?: Cx.StyleProp,

   /** CSS styles to be applied when drag cursor is near the drop zone. */
   nearStyle?: Cx.StyleProp,

   /** CSS styles to be applied when drag operations begin used to highlight drop zones. */
   farStyle?: Cx.StyleProp,

   /** Additional CSS class to be applied when drag cursor is over the drop zone. */
   overClass?: Cx.ClassProp,

   /** Additional CSS class to be applied when drag cursor is near the drop zone. */
   nearClass?: Cx.ClassProp,

   /** Additional CSS class to be applied when drag operations begin used to highlight drop zones. */
   farClass?: Cx.ClassProp,

   /** Distance in `px` used to determine if cursor is near the dropzone. If not configured, cursor is never considered near. */
   nearDistance?: number,

   /** Bindable data related to the DropZone that might be useful inside onDrop operations. */
   data?: Cx.StructuredProp,

   /** 
    * Inflate the drop zone's bounding box so it activates on cursor proximity. 
    * Useful for invisible drop-zones that are only a few pixels tall/wide.  
    */
   inflate?: number,

   /**
    * Inflate the drop zone's bounding box horizontally so it activates on cursor proximity.
    * Useful for invisible drop-zones that are only a few pixels tall/wide.
    */
   hinflate?: number,

   /**
    * Inflate the drop zone's bounding box vertically so it activates on cursor proximity.
    * Useful for invisible drop-zones that are only a few pixels tall/wide.
    */
   vinflate?: number,

   /** Base CSS class to be applied to the element. Defaults to 'dropzone'. */
   baseClass?: string,

   /** A callback method invoked when dragged item is finally dropped.
    The callback takes two arguments:
    * dragDropEvent - An object containing information related to the source
    * instance
    Return value is written into dragDropEvent.result and can be passed
    to the source's onDragEnd callback. */
   onDrop?: (event?: DragEvent, instance?: Instance) => any,

   /** A callback method used to test if dragged item (source) is compatible
    with the drop zone. */
   onDropTest?: (event?: DragEvent, instance?: Instance) => boolean,

   /** A callback method invoked when the dragged item gets close to the drop zone.
    See also `nearDistance`. */
   onDragNear?: (event?: DragEvent, instance?: Instance) => void,

   /** A callback method invoked when the dragged item is dragged away. */
   onDragAway?: (event?: DragEvent, instance?: Instance) => void,

   /** A callback method invoked when the dragged item is dragged over the drop zone.
    The callback is called for each `mousemove` or `touchmove` event. */
   onDragOver?: (event?: DragEvent, instance?: Instance) => void,

   /** A callback method invoked when the dragged item is dragged over the drop zone
    for the first time. */
   onDragEnter?: (event?: DragEvent, instance?: Instance) => void,

   /** A callback method invoked when the dragged item leaves the drop zone area. */
   onDragLeave?: (event?: DragEvent, instance?: Instance) => void,

   /** A callback method invoked when at the beginning of the drag & drop operation. */
   onDragStart?: (event?: DragEvent, instance?: Instance) => void,

   /** A callback method invoked when at the end of the drag & drop operation. */
   onDragEnd?: (event?: DragEvent, instance?: Instance) => void,
}

export class DropZone extends Cx.Widget<DropZoneProps> {}
