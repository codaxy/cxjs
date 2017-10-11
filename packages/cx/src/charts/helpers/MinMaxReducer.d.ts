import * as Cx from '../../core';
import {PointReducerProps} from './PointReducer';

interface MinMaxFinderProps extends PointReducerProps {

   /* A binding used to receive the x value of the point with the minimum value */
   minX?: Cx.Bind,

   /* A binding used to receive the y value of the point with the minimum value */
   minY?: Cx.Bind,

   /* A binding used to receive the x value of the point with the maximum value */
   maxX?: Cx.Bind,

   /* A binding used to receive the x value of the point with the maximum value */
   maxY?: Cx.Bind,

   /* An object used for filtering data points. Available as accumulator.params inside the onMap function. */
   params: Cx.StructuredProp
}

/** Find minimum and maximum points of a point serie */
export class MinMaxFinder extends Cx.Widget<MinMaxFinderProps> {}