import * as Cx from '../core';
import { ColumnBarGraphBaseProps } from './ColumnBarGraphBase';

interface BarGraphProps extends ColumnBarGraphBaseProps {

   baseClass?: string,

   /** 
    * Name of the property which holds the base value. 
    * Default value is `false`, which means x0 value is not read from the data array.
    */
   x0Field?: string,

   /** Base value. Default value is `0`. */
   x0?: number,
   
   legendShape?: string
   
}

export class BarGraph extends Cx.Widget<BarGraphProps> {}