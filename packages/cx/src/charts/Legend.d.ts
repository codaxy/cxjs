import * as Cx from '../core';

interface LegendProps extends Cx.HtmlElementProps {
   
   /** Name of the legend. Default is `legend`. */
   name?: string,
   
   /** Base CSS class to be applied to the element. Defaults to `legend`. */
   baseClass?: string,
   
   /** Switch to vertical mode. */
   vertical?: boolean,

}

export class Legend extends Cx.Widget<LegendProps> {

   static Scope() : any;

}