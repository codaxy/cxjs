import * as Cx from "../core";
import { BoundedObjectProps } from "../svg/BoundedObject";


interface PieLabelProps extends BoundedObjectProps {

    /** Distance in pixels, for which the labels will be separated from the pie chart. Default value is 100px. */
    distance: Cx.NumberProp
}
export class PieLabel extends Cx.Widget<PieLabelProps> {};
