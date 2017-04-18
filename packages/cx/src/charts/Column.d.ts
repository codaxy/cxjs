import * as Cx from '../core';
import { ColumnBarBaseProps } from './ColumnBarBase';

interface ColumnProps extends ColumnBarBaseProps {
   
   /** Column base value. Default value is `0`. */
   y0?: Cx.NumberProp,

   /** Size (width) of the column in axis units. */
   size?: Cx.NumberProp,

   /** Set to true to auto calculate size and offset. Available only if the x axis is a category axis. */
   autoSize?: Cx.BooleanProp,

   baseClass?: boolean,
   legendShape?: string

}

export class Column extends Cx.Widget<ColumnProps> {}