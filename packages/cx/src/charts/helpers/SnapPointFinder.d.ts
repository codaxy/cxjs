import * as Cx from "../../core";
import { PointReducerProps } from "./PointReducer";

interface SnapPointFinderProps extends PointReducerProps {
   /* Cursor X value. */
   cursorX?: Cx.NumberProp;

   /* Cursor Y value */
   cursorY?: Cx.NumberProp;

   /* A binding used to receive the x value of the nearest point.*/
   snapX?: Cx.Prop<any>;

   /* A binding used to receive the y value of the nearest point. */
   snapY?: Cx.Prop<any>;

   /* A binding used to receive the record prop */
   snapRecord?: Cx.Prop<Cx.Record>;

   /* Maximum distance between cursor and the snap point. */
   maxDistance?: number;
}

export class SnapPointFinder extends Cx.Widget<SnapPointFinderProps> {}
