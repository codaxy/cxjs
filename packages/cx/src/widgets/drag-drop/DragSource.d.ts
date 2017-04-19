import * as Cx from '../../core';

interface DragSourceProps extends Cx.StyledContainerProps {

   data?: Cx.StructuredProp,
   hideOnDrag?: boolean,
   handled?: boolean,
   
   /** Base CSS class to be applied to the element. Defaults to 'dragsource'. */
   baseClass?: string,

}

export class DragSource extends Cx.Widget<DragSourceProps> {}
