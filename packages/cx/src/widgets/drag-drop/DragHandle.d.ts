import * as Cx from '../../core';

interface DragHandleProps extends Cx.StyledContainerProps {
   
   /** Base CSS class to be applied to the element. Defaults to 'draghandle'. */
   baseClass?: string
   
}

export class DragHandle extends Cx.Widget<DragHandleProps> {}
