import * as Cx from '../../core';

interface PaginationProps extends Cx.WidgetProps, Cx.StyledContainerProps {

   page?: Cx.NumberProp,
   length?: Cx.NumberProp,
   pageCount?: Cx.NumberProp,

   /** Base CSS class to be applied to the element. Defaults to 'pagination'. */
   baseClass?: string
   
}

export class Pagination extends Cx.Widget<PaginationProps> {}
