import * as Cx from '../../core';
import {AxisProps} from './Axis';

interface TimeAxisProps extends AxisProps {
   
   /** Minimum value. */
   min?: Cx.NumberProp,

   /** Maximum value. */
   max?: Cx.NumberProp,

   /** Base CSS class to be applied to the element. Defaults to `timeaxis`. */
   baseClass?: string,

   /** A number ranged between `0-2`. `0` means that the range is aligned with the lowest ticks. Default value is `1`, which means that the range is aligned with medium ticks. Use value `2` to align with major ticks. */
   snapToTicks?: 0 | 1 | 2 | false,

   tickDivisions?: { [prop: string]: Array<number[]> },
   minLabelDistance?: number,
   minTickUnit?: string,

}

export class TimeAxis extends Cx.Widget<TimeAxisProps> {}