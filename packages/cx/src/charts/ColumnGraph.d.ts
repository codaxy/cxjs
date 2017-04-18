import * as Cx from '../core';
import { ColumnBarGraphBaseProps } from './ColumnBarGraphBase';

interface ColumnGraphProps extends ColumnBarGraphBaseProps {

   baseClass?: string,
   
   /** 
    * Name of the property which holds the base value. 
    * Default value is `false`, which means y0 value is not read from the data array. 
    */
   y0Field?: string,

   /** Column base value. Default value is `0`. */
   y0?: number,

   legendShape?: string
   
}

export class ColumnGraph extends Cx.Widget<ColumnGraphProps> {}