import * as Cx from '../core';
import { BoundedObject, BoundedObjectProps } from '../svg/BoundedObject';

interface RangeProps extends BoundedObjectProps {
   
   /** The `x1` value binding or expression. */
   x1?: Cx.NumberProp,

   /** The `y1` value binding or expression. */
   y1?: Cx.NumberProp,
   
   /** The `x2` value binding or expression. */
   x2?: Cx.NumberProp,

   /** The `y2` value binding or expression. */
   y2?: Cx.NumberProp,

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: Cx.NumberProp,

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: Cx.BooleanProp,

   /** Name of the item as it will appear in the legend. */
   name?: Cx.StringProp,

   /** Name of the legend to be used. Default is `legend`. */
   legend?: Cx.StringProp,

   invisible?: boolean,

   /**
    *  Name of the horizontal axis. The value should match one of the horizontal axes set
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    */
   xAxis?: string,

   /** 
    * Name of the vertical axis. The value should match one of the vertical axes set 
    * in the `axes` configuration if the parent `Chart` component. Default value is `y`.
    */
   yAxis?: string,
   
   xSize?: number,
   ySize?: number,
   xOffset?: number,
   yOffset?: number,

   /** Base CSS class to be applied to the element. Defaults to `range`. */
   baseClass?: string,

   /** Set to `true` to make the range draggable along the X axis. */
   draggableX?: boolean,

   /** Set to `true` to make the range draggable along the Y axis. */
   draggableY?: boolean,

   /** Set to `true` to make the range draggable along the X and Y axis. */
   draggable?: boolean,

   /** Constrain the range position to min/max values of the X axis during drag operations. */
   constrainX?: boolean,

   /** Constrain the range position to min/max values of the Y axis during drag operations. */
   constrainY?: boolean,

   /** When set to `true`, it is equivalent to setting `constrainX` and `constrainY` to true. */
   constrain?: boolean,
   
   legendAction?: string,
   hidden?: boolean
   
}

export class Range extends Cx.Widget<RangeProps> {}