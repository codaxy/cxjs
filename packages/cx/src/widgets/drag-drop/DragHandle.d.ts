import * as Cx from '../../core';

interface DragHandleProps extends Cx.PureContainerProps {

   styled?: boolean,
   baseClass?: string
   
}

export class DragHandle extends Cx.Widget<DragHandleProps> {}
