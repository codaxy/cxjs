import * as Cx from "../core";
import { BoundedObjectProps } from "../svg";

interface SwimlaneProps extends BoundedObjectProps {
   /** The `x` value binding or expression. */
   x?: Cx.Prop<string | number>;

   /** The `y` value binding or expression. */
   y?: Cx.Prop<string | number>;

   /** Represents a swimlane size. */
   size?: Cx.NumberProp;

   /** Switch to vertical swimlanes. */
   vertical?: boolean;

   /**The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and readability. */
   laneOffset?: Cx.NumberProp;

   /** Style object applied to the swimlanes. */
   laneStyle?: StyleProp;
}

export class Swimlane extends Cx.Widget<SwimlaneProps> {}
