import * as Cx from "../../core";
import { Instance } from "../../ui/Instance";

interface DragSourceProps extends Cx.StyledContainerProps {
   /**
    * Data about the drag source that can be used by drop zones to test if
    * drag source is acceptable and to perform drop operations.
    */
   data?: any;

   /**
    * Set to true to hide the element while being dragged.
    * Use if drop zones are configured to expand to indicate where drop will occur.
    */
   hideOnDrag?: boolean;

   /** Set to true to indicate that this drag source can be dragged only by using an inner DragHandle. */
   handled?: boolean;

   /** Base CSS class to be applied to the element. Defaults to 'dragsource'. */
   baseClass?: string;

   onDragStart?: (e, instance: Instance) => any;

   onDragEnd?: (e, instance: Instance) => void;

   id?: Cx.StringProp;

   /** Custom contents to be displayed during drag & drop operation. */
   clone?: Cx.Config;

   /** CSS styles to be applied to the clone of the element being dragged. */
   cloneStyle?: Cx.StyleProp;

   /** CSS styles to be applied to the element being dragged. */
   draggedStyle: Cx.StyleProp;

   /** Additional CSS class to be applied to the clone of the element being dragged. */
   cloneClass: Cx.ClassProp;

   /** Additional CSS class to be applied to the element being dragged. */
   draggedClass: Cx.ClassProp;
}

export class DragSource extends Cx.Widget<DragSourceProps> {}
