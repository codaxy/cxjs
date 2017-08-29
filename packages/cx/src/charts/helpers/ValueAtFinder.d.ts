import * as Cx from '../../core';
import {PointReducerProps} from './PointReducer';

interface ValueAtFinderProps extends PointReducerProps {

   /* Probe value. */
   at?: Cx.NumberProp,

   /* A binding used to receive the measured value */
   value?: Cx.Bind
}

/** Calculate value at a given point on the graph */
export class ValueAtFinder extends Cx.Widget<ValueAtFinderProps> {}