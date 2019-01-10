import * as Cx from '../core';

interface LegendProps extends Cx.HtmlElementProps {
   
   /** Name of the legend. Default is `legend`. */
   name?: string,
   
   /** Base CSS class to be applied to the element. Defaults to `legend`. */
   baseClass?: string,
   
   /** Switch to vertical mode. */
   vertical?: boolean,

   /** Size of the svg shape container in pixels. Default value is 20. */
   svgSize?: number,

   /** Shape size in pixels. Default value is 18. */
   shapeSize?: number
}

export class Legend extends Cx.Widget<LegendProps> {

   static Scope() : any;

}