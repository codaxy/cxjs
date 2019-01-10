import * as Cx from '../core';
import { ColumnBarBaseProps } from './ColumnBarBase';

interface BarProps extends ColumnBarBaseProps {
   
   /** Base value. Default value is `0`.  */
   x0?: Cx.NumberProp,
   
   /** Size (width) of the column in axis units. */
   size?: Cx.NumberProp,

   /** Set to true to auto calculate size and offset. Available only if the x axis is a category axis. */
   autoSize?: Cx.BooleanProp,
   
   height?: number,
 
   /** Base CSS class to be applied to the element. Defaults to `bar`. */
   baseClass?: string,

   /** Tooltip configuration. For more info see Tooltips. */
   tooltip?: Cx.StringProp | Cx.StructuredProp,

   /** Selection configuration. */
   selection?: Cx.Config

}

export class Bar extends Cx.Widget<BarProps> {}