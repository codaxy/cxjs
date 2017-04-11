import * as Cx from '../../core';
import { IDropZone } from './ops';

interface DropZoneProps extends IDropZone, Cx.StyledContainerProps {
   
   overStyle?: Cx.StyleProp,
   nearStyle?: Cx.StyleProp,
   farStyle?: Cx.StyleProp,
   overClass?: Cx.ClassProp,
   nearClass?: Cx.ClassProp,
   farClass?: Cx.ClassProp,
   nearDistance?: number,
   inflate?: number,
   baseClass?: string  
   
}

export class DropZone extends Cx.Widget<DropZoneProps> {}
