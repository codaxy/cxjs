import * as Cx from '../core';

interface ScatterGraphProps extends Cx.WidgetProps {
   
   /** 
    * Data for the graph. Each entry should be an object with at least two properties
    * whose names should match the `xField` and `yField` values. 
    */
   data?: Cx.RecordsProp,

   /** Size (width) of the column in axis units. */
   size?: Cx.NumberProp,

   shape?: Cx.StringProp,

   /** Style object applied to the wrapper div. Used for setting the dimensions of the field. */
   style?: Cx.StyleProp,

   /** 
    * Additional CSS classes to be applied to the field. If an object is provided, 
    * all keys with a "truthy" value will be added to the CSS class list.
    */
   class?: Cx.ClassProp,

    /** 
    * Additional CSS classes to be applied to the field. If an object is provided, 
    * all keys with a "truthy" value will be added to the CSS class list.
    */
   className?: Cx.ClassProp,

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: Cx.NumberProp,

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: Cx.StringProp,

   /** Name of the item as it will appear in the legend. */
   name?: Cx.StringProp,

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: Cx.BooleanProp,
   
   /** Base CSS class to be applied to the element. Defaults to `scattergraph`. */
   baseClass?: string,

   /** 
    * Name of the horizontal axis. The value should match one of the horizontal axes set 
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`. 
    */
   xAxis?: string,

   /** 
    * Name of the vertical axis. The value should match one of the vertical axes set 
    * in the `axes` configuration if the parent `Chart` component. Default value is `y`. 
    */
   yAxis?: string,

   /** Name of the property which holds the x value. Default value is `x`. */
   xField?: string,

   /** Name of the property which holds the y value. Default value is `y`. */
   yField?: string,

   /** Name of the property which holds the size value. Do not set if `size` is used. */
   sizeField?: string,

   pure?: boolean,

   /** Name of the legend to be used. Default is legend. */
   legend?: string,
   
   legendAction?: string

}

export class ScatterGraph extends Cx.Widget<ScatterGraphProps> {}