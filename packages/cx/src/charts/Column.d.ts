import * as Cx from '../core';
import { ColumnBarBaseProps } from './ColumnBarBase';
import { Selection } from '../ui/selection';


interface ColumnProps extends ColumnBarBaseProps {
   
   /** Column base value. Default value is `0`. */
   y0?: Cx.NumberProp,

   /** Size (width) of the column in axis units. */
   size?: Cx.NumberProp,

   /** Set to true to auto calculate size and offset. Available only if the x axis is a category axis. */
   autoSize?: Cx.BooleanProp,
   
   /** Base CSS class to be applied to the element. Defaults to `column`. */
   baseClass?: boolean,
   
   width?: number,

   selection?: Selection,
   tooltip?: Cx.StringProp

}

export class Column extends Cx.Widget<ColumnProps> {}