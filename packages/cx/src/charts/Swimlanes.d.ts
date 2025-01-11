import * as Cx from "../core";
import { BoundedObject, BoundedObjectProps } from "../svg/BoundedObject";

interface SwimlanesProps extends BoundedObjectProps {
   /**
    * Name of the horizontal axis. The value should match one of the horizontal axes set
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    * Set to `false` to hide the grid lines in x direction.
    */
   xAxis?: string | boolean;

   /**
    * Name of the vertical axis. The value should match one of the vertical axes set
    * in the `axes` configuration if the parent `Chart` component. Default value is `y`.
    * Set to `false` to hide the grid lines in y direction.
    */
   yAxis?: string | boolean;

   /** Base CSS class to be applied to the element. Defaults to `swimlanes`. */
   baseClass?: string;

   /** Represents a swimlane size. */
   size?: Cx.NumberProp;

   /**
    * Represents a swimlane step. Define a step on which a swimlane will be rendered. (eg. step 2 will render
    * every second swimlane in the chart.)
    */
   step?: Cx.NumberProp;

   /** Switch to vertical swimlanes. */
   vertical?: boolean;

   /**The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and readability. */
   laneOffset?: Cx.NumberProp;

   /** Style object applied to the swimlanes. */
   laneStyle?: StyleProp;
}

export class Swimlanes extends Cx.Widget<SwimlanesProps> {}
