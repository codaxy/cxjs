import * as Cx from '../../core';

interface DragSourceProps extends Cx.StyledContainerProps {
   data?: Cx.StructuredProp,
   hideOnDrag?: boolean,
   handled?: boolean,
   baseClass?: string,
}

export class DragSource extends Cx.Widget<DragSourceProps> {}
