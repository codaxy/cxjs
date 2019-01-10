import * as Cx from '../core';
import { BoundedObject, BoundedObjectProps } from '../svg/BoundedObject';

interface GridlinesProps extends BoundedObjectProps {
   
   /** 
    * Name of the horizontal axis. The value should match one of the horizontal axes set 
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    * Set to `false` to hide the grid lines in x direction.
    */
   xAxis?: string | boolean,

   /** 
    * Name of the vertical axis. The value should match one of the vertical axes set
    * in the `axes` configuration if the parent `Chart` component. Default value is `y`.
    * Set to `false` to hide the grid lines in y direction.
    */
   yAxis?: string | boolean,
   
   /** Base CSS class to be applied to the element. Defaults to `gridlines`. */
   baseClass?: string

}

export class Gridlines extends Cx.Widget<GridlinesProps> {}