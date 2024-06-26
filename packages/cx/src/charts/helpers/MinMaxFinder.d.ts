import * as Cx from "../../core";
import { PointReducerProps } from "./PointReducer";

interface MinMaxFinderProps extends PointReducerProps {
   /* A binding used to receive the x value of the point with the minimum value */
   minX?: Cx.Bind | Cx.AccessorChain<number>;

   /* A binding used to receive the y value of the point with the minimum value */
   minY?: Cx.Bind | Cx.AccessorChain<number>;

   /* A binding used to receive the x value of the point with the maximum value */
   maxX?: Cx.Bind | Cx.AccessorChain<number>;

   /* A binding used to receive the x value of the point with the maximum value */
   maxY?: Cx.Bind | Cx.AccessorChain<number>;

   /* An object used for filtering data points. Available as accumulator.params inside the onMap function. */
   params?: Cx.StructuredProp;
}

/** Find minimum and maximum points of a point series */
export class MinMaxFinder extends Cx.Widget<MinMaxFinderProps> {}
