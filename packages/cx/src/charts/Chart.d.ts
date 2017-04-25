import * as Cx from '../core';
import { BoundedObject, BoundedObjectProps } from '../svg/BoundedObject';

interface ChartProps extends BoundedObjectProps {
   
   /** Axis definition. Each key represent an axis, and each value hold axis configuration. */
   axes?: Cx.Config,

}

export class Chart extends Cx.Widget<ChartProps> {}