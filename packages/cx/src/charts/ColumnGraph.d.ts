import * as Cx from '../core';
import { ColumnBarGraphBaseProps } from './ColumnBarGraphBase';

interface ColumnGraphProps extends ColumnBarGraphBaseProps {
   
   /** Base CSS class to be applied to the element. Defaults to `columngraph`. */
   baseClass?: string,
   
   /** 
    * Name of the property which holds the base value. 
    * Default value is `false`, which means y0 value is not read from the data array. 
    */
   y0Field?: string,

   /** Column base value. Default value is `0`. */
   y0?: Cx.NumberProp,

}

export class ColumnGraph extends Cx.Widget<ColumnGraphProps> {}