import * as Cx from '../core';
import { BoundedObject, BoundedObjectProps } from '../svg/BoundedObject';

interface MarkerProps extends BoundedObjectProps {

   /** The `x` value binding or expression. */
   x?: Cx.Prop<string | number>,
   
   /** The `y` value binding or expression. */
   y?:  Cx.Prop<string | number>,

   /** Shape kind. `circle`, `square`, `triangle`, etc. */
   shape?: Cx.StringProp,

   disabled?: Cx.BooleanProp,

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: Cx.Prop<string | number>,

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: Cx.StringProp,

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: Cx.StringProp,

   legendColorIndex?: Cx.NumberProp,

   /** Name of the item as it will appear in the legend. */
   name?: Cx.StringProp,

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: Cx.BooleanProp,

   xOffset?: number,
   yOffset?: number,

   /** Size of the shape in pixels. */
   size?: Cx.NumberProp,

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
   
   /** Base CSS class to be applied to the element. Defaults to `marker`. */
   baseClass?: string,

   /** Set to `true` to make the shape draggable along the X axis. */
   draggableX?: boolean,

   /** Set to `true` to make the shape draggable along the Y axis. */
   draggableY?: boolean,

   /** Set to `true` to make the shape draggable along the X and Y axis. */
   draggable?: boolean,

   /** Constrain the marker position to min/max values of the X axis during drag operations. */
   constrainX?: boolean,

   /** Constrain the marker position to min/max values of the Y axis during drag operations. */
   constrainY?: boolean,

   /** When set to `true`, it is equivalent to setting `constrainX` and `constrainY` to true. */
   constrain?: boolean,

   /** Name of the legend to be used. Default is `legend`. */
   legend?: string,

   legendAction?: string,

   /** Tooltip configuration. For more info see Tooltips. */
   tooltip?: Cx.StringProp | Cx.StructuredProp

   /** Set to true to hide the marker. The marker will still participate in axis range calculations. */
   hidden?: boolean
}

export class Marker extends Cx.Widget<MarkerProps> {}