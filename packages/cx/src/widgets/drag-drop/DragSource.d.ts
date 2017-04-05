import * as Cx from '../../core';

interface DragSourceProps extends Cx.StyledContainerProps {
   data: any,
   baseClass?: string,
   hideOnDrag?: boolean,
   handled?: boolean
}

export class DragSource extends Cx.Widget<DragSourceProps> {}
