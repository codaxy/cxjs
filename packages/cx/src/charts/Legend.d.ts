import * as Cx from "../core";

interface LegendProps extends Cx.HtmlElementProps {
   /** Name of the legend. Default is `legend`. */
   name?: string;

   /** Base CSS class to be applied to the element. Defaults to `legend`. */
   baseClass?: string;

   /** Switch to vertical mode. */
   vertical?: boolean;

   /** Size of the svg shape container in pixels. Default value is 20. */
   svgSize?: number;

   /** Shape size in pixels. Default value is 18. */
   shapeSize?: number;

   /** Default shape that will be applied to the all legend items. */
   shape?: Cx.StringProp;

   /** CSS style that will be applied to the legend entry. */
   entryStyle?: Cx.StyleProp;

   /** CSS class that will be applied to the legend entry. */
   entryClass?: Cx.ClassProp;

   /** CSS style that will be applied to the legend entry value segment. */
   valueStyle?: Cx.StyleProp;

   /** CSS class that will be applied to the legend entry value segment. */
   valueClass?: Cx.ClassProp;

   /** Set to true to show values. Mostly used for PieChart legends. */
   showValues?: Cx.BooleanProp;

   /** Format used for values, i.e. n;2 or currency. The default value is s.*/
   valueFormat?: string;
}

export class Legend extends Cx.Widget<LegendProps> {
   static Scope(): any;
}

export class LegendScope extends Cx.Widget<Cx.PureContainerProps> {}
