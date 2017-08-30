import * as Cx from '../../core';
import {PointReducerProps} from './PointReducer';

interface SnapPointFinderProps extends PointReducerProps {

   /* Cursor X value. */
   cursorX?: Cx.NumberProp,

   /* Cursor Y value */
   cursorY?: Cx.NumberProp,

   /* A binding used to receive the x value of the nearest point.*/
   snapX?: Cx.Bind,

   /* A binding used to receive the y value of the nearest point. */
   snapY?: Cx.Bind
}

export class SnapPointFinder extends Cx.Widget<SnapPointFinderProps> {}