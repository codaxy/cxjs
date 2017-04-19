import * as Cx from '../../core';

interface DropZoneProps extends Cx.StyledContainerProps {
   
   overStyle?: Cx.StyleProp,
   nearStyle?: Cx.StyleProp,
   farStyle?: Cx.StyleProp,
   overClass?: Cx.ClassProp,
   nearClass?: Cx.ClassProp,
   farClass?: Cx.ClassProp,
   nearDistance?: number,
   inflate?: number,

   /** Base CSS class to be applied to the element. Defaults to 'dropzone'. */
   baseClass?: string  
   
}

export class DropZone extends Cx.Widget<DropZoneProps> {}
