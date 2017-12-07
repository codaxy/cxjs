import * as Cx from '../core';

interface ColumnBarBaseProps extends Cx.StyledContainerProps {
   
   /** The `x` value binding or expression. */
   x?: Cx.Prop<string | number>,

   /** The `y` value binding or expression. */
   y?: Cx.Prop<string | number>,

   disabled?: Cx.BooleanProp,

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: Cx.NumberProp,

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: Cx.StringProp,

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: Cx.StringProp,

   /** Name of the item as it will appear in the legend. */
   name?: Cx.StringProp,

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: Cx.BooleanProp,

   /** Indicate that columns should be stacked on top of the other columns. Default value is `false`. */
   stacked?: Cx.BooleanProp,

   /** Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`. */
   stack?: Cx.StringProp,

   /** Of center offset of the column. Use this in combination with `size` to align multiple series on the same chart. */
   offset?: Cx.NumberProp,
   
   /** 
    * Name of the horizontal axis. The value should match one of the horizontal axes set 
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    */
   xAxis?: string,

   /** 
    * Name of the vertical axis. The value should match one of the vertical axes set
    *  in the `axes` configuration if the parent `Chart` component. Default value is `y`. 
    */
   yAxis?: string,

   /** Name of the legend to be used. Default is `legend`. */
   legend?: string,
   
   legendAction?: string,
   legendShape?: string

}

export class ColumnBarBase extends Cx.Widget<ColumnBarBaseProps> {}