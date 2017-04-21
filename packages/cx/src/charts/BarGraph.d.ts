import * as Cx from '../core';
import { ColumnBarGraphBaseProps } from './ColumnBarGraphBase';

interface BarGraphProps extends ColumnBarGraphBaseProps {

   /** Base CSS class to be applied to the element. Defaults to `bargraph`. */
   baseClass?: string,

   /** 
    * Name of the property which holds the base value. 
    * Default value is `false`, which means x0 value is not read from the data array.
    */
   x0Field?: string,
  
}

export class BarGraph extends Cx.Widget<BarGraphProps> {}