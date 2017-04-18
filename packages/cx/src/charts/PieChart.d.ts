import * as Cx from '../core';
import { BoundedObject, BoundedObjectProps } from '../svg/BoundedObject';

interface PieChartProps extends BoundedObjectProps {
   
   /** Angle in degrees. Default is `360` which represents the full circle. */
   angle?: Cx.NumberProp,
   
}

export class PieChart extends Cx.Widget<PieChartProps> {}