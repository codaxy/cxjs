import * as Cx from '../core';
import { KeySelection, PropertySelection } from '../ui/selection';

interface ColumnBarGraphBaseProps extends Cx.WidgetProps {
   
   /** 
    * Data for the graph. Each entry should be an object with at least two properties
    *  whose names should match the `xField` and `yField` values.
    */
   data?: Cx.RecordsProp,

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: Cx.NumberProp,

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: Cx.StringProp,

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: Cx.StringProp,

   /** Name of the item as it will appear in the legend. */
   name?: Cx.StringProp,

   /** Size (width) of the column in axis units. */
   size?: Cx.NumberProp,

   /** Of center offset of the column. Use this in combination with `size` to align multiple series on the same chart. */
   offset?: Cx.NumberProp,

   /** Set to true to auto-calculate size and offset. Available only if the x axis is a category axis. */
   autoSize?: Cx.BooleanProp,

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: Cx.BooleanProp,

   /** Indicate that columns should be stacked on top of the other columns. Default value is `false`. */
   stacked?: Cx.BooleanProp,

   /** Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`. */
   stack?: Cx.StringProp,
   
   /** Name of the horizontal axis. The value should match one of the horizontal axes set
    *  in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    */
   xAxis?: string,

   /**
    *  Name of the vertical axis. The value should match one of the vertical axes set 
    * in the `axes` configuration if the parent `Chart` component. Default value is `y`.
    */
   yAxis?: string,

   /** Name of the property which holds the x value. Default value is `x`. */
   xField?: string,

   /** Name of the property which holds the y value. Default value is `y`. */
   yField?: string,

   colorIndexField?: boolean,

   /** Name of the legend to be used. Default is `legend`. */
   legend?: string,

   legendAction?: string,
   legendShape?: string,

   /** Selection configuration. */
   selection?: { type: typeof PropertySelection | typeof KeySelection, [prop: string]: any }

}

export class ColumnBarGraphBase extends Cx.Widget<ColumnBarGraphBaseProps> {}