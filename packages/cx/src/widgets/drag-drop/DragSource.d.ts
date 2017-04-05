import * as Cx from '../../core';

interface DragSourceProps extends Cx.PureContainerProps {

   data: any,
   styled?: boolean,
   baseClass?: string,
   hideOnDrag?: boolean,
   handled?: boolean

}

export class DragSource extends Cx.Widget<DragSourceProps> {}
