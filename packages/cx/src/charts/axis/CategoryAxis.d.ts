import * as Cx from '../../core';
import {AxisProps} from './Axis';

interface CategoryAxisProps extends AxisProps {
   
   /** Uniform axes provide exact size and offset for all entries, while non-uniform axes adapt their size and offset to the number of entries under each category. */
   uniform?: Cx.BooleanProp,

   /** Names corresponding the given `values`. For example, `values` may be 0 .. 11 and `names` could be Jan .. Dec. */
   names?: Cx.Prop<any[] | Cx.Config>,

   /** Values used to initialize the axis. If an object is provided, keys are used for values and values are used for names. */
   values?: Cx.Prop<any[] | Cx.Config>,

   /** Sometimes, there is not enough data and each category takes a lot of space. `minSize` can be used to add fake entries up to the specified number, so everything looks normal. */
   minSize?: Cx.NumberProp,

   /** Base CSS class to be applied to the element. Defaults to `categoryaxis`. */
   baseClass?: string
}

export class CategoryAxis extends Cx.Widget<CategoryAxisProps> {}