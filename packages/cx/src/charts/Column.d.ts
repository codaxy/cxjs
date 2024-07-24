import * as Cx from "../core";
import { ColumnBarBaseProps } from "./ColumnBarBase";

interface ColumnProps extends ColumnBarBaseProps {
   /** Column base value. Default value is `0`. */
   y0?: Cx.NumberProp;

   /** Size (width) of the column in axis units. */
   size?: Cx.NumberProp;

   /** Set to true to auto calculate size and offset. Available only if the x axis is a category axis. */
   autoSize?: Cx.BooleanProp;

   /** Base CSS class to be applied to the element. Defaults to `column`. */
   baseClass?: boolean;

   width?: number;

   /** Selection configuration. */
   selection?: Config;

   /** Tooltip configuration. For more info see Tooltips. */
   tooltip?: Cx.StringProp | Cx.StructuredProp;

   /** Minimum column size in pixels. Useful for indicating very small values. Default value is 0.5. */
   minPixelHeight?: number;
}

export class Column extends Cx.Widget<ColumnProps> {}
