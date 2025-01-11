import * as Cx from "../core";

interface RangeMarkerProps extends Cx.StyledContainerProps {
   /** The `x` value binding or expression. */
   x?: Cx.NumberProp;

   /** The `y` value binding or expression. */
   y?: Cx.NumberProp;

   /** The shape of marker, Could be `min`, `max`, `line`. Default to `line`. */
   shape?: Cx.StringProp;

   /** Switch to vertical mode. */
   vertical?: Cx.BooleanProp;

   /** Size of the range marker. */
   size?: Cx.NumberProp;

   /** Style object applied to the range marker. */
   lineStyle?: Cx.StyleProp;

   /** Class object applied to the range marker. */
   lineClass?: Cx.StyleProp;

   /** Size of vertical or horizontal caps. */
   capSize?: Cx.NumberProp;

   /** The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and readability. */
   laneOffset?: Cx.NumberProp;

   /** Inflate the range marker.*/
   inflate?: Cx.NumberProp;
}

export class RangeMarker extends Cx.Widget<RangeMarkerProps> {}
