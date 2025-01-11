import * as Cx from "../../core";
import { PointReducerProps } from "./PointReducer";

interface SnapPointFinderProps extends PointReducerProps {
   /* Cursor X value. */
   cursorX?: Cx.NumberProp;

   /* Cursor Y value */
   cursorY?: Cx.NumberProp;

   /* A binding used to receive the x value of the nearest point.*/
   snapX?: Cx.Bind | Cx.AccessorChain<number> | Cx.AccessorChain<string>;

   /* A binding used to receive the y value of the nearest point. */
   snapY?: Cx.Bind | Cx.AccessorChain<number> | Cx.AccessorChain<string>;

   /* A binding used to receive the record prop */
   snapRecord?: Cx.Prop<Cx.Record>;

   /* Maximum distance between cursor and the snap point. Default value is 50. Adjust accordingly for large distances, e.g. set to Infinity when using TimeAxis */
   maxDistance?: number;

   /* A function used to convert x values into numeric format. Commonly used with dates. */
   convertX?: (value: number | string) => number;

   /* A function used to convert y values into numeric format. Commonly used with dates. */
   convertY?: (value: number | string) => number;
}

export class SnapPointFinder extends Cx.Widget<SnapPointFinderProps> {}
