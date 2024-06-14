import * as Cx from "../../core";
import { PointReducerProps } from "./PointReducer";

interface ValueAtFinderProps extends PointReducerProps {
   /* X axis probe value. */
   at?: Cx.NumberProp | Cx.StringProp;

   /* A binding used to receive the measured y axis value */
   value?: Cx.Bind | Cx.AccessorChain<number>;

   /* A function used to convert x values into numeric format. Commonly used with dates. */
   convert?: (value: number | string) => number;
}

/** Calculate value at a given point on the graph */
export class ValueAtFinder extends Cx.Widget<ValueAtFinderProps> {}
