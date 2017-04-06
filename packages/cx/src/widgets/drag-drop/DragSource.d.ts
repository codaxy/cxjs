import * as Cx from '../../core';

export interface DragSourceProps extends Cx.StyledContainerProps {
   
   data: Cx.StructuredProp,
   baseClass?: string,
   hideOnDrag?: boolean,
   handled?: boolean
   
}

export class DragSource extends Cx.Widget<DragSourceProps> {}
