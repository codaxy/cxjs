import * as Cx from '../core';

interface LineGraphProps extends Cx.WidgetProps {

   /** 
    * Data for the graph. Each entry should be an object with at least two properties 
    * whose names should match the `xField` and `yField` values. 
    */    
   data?: Cx.RecordsProp,
   
   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: Cx.NumberProp,

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: Cx.StringProp,

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: Cx.StringProp,

   /** 
    * Additional CSS classes to be applied to the field. 
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. 
    */
   class?: Cx.ClassProp,

   /** 
    * Additional CSS classes to be applied to the field.
    * If an object is provided, all keys with a "truthy" value will be added to the CSS class list. 
    */
   className?: Cx.ClassProp,


   lineStyle?: Cx.StyleProp,
   areaStyle?: Cx.StyleProp,

   /** Area switch. Default value is `false`. */
   area?: Cx.BooleanProp,

   /** Line switch. By default, the line is shown. Set to `false` to hide the line and draw only the area. */
   line?: Cx.BooleanProp,

   /** Base value used for area charts. Default value is `0`. */
   y0?: Cx.NumberProp,

   /** Name of the item as it will appear in the legend. */
   name?: Cx.StringProp,

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: Cx.BooleanProp,

   /** Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`. */
   stack?: Cx.StringProp,

   /** Indicate that columns should be stacked on top of the other columns. Default value is `false`. */
   stacked?: Cx.BooleanProp

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
   
   /** Base CSS class to be applied to the element. Defaults to `linegraph`. */
   baseClass?: string,

   /** Name of the property which holds the y0 value. Default value is `false`, which means y0 value is not read from the data array. */
   y0Field?: string,

   /** Name of the legend to be used. Default is `legend`. */
   legend?: string,

   legendAction?: string,
   legendShape?: string
}

export class LineGraph extends Cx.Widget<LineGraphProps> {}