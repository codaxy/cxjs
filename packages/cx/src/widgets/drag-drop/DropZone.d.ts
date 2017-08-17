import * as Cx from '../../core';

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
   baseClass?: string  
   
}

export class DropZone extends Cx.Widget<DropZoneProps> {}
