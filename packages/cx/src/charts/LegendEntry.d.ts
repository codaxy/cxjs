import * as Cx from "../core";

interface LegendEntryProps extends Cx.HtmlElementProps {
   /** Indicate that entry is selected. */
   selected?: Cx.BooleanProp;

   /** Shape of the symbol. `square`, `circle`, `triangle` etc. */
   shape?: Cx.StringProp;

   /** Size of the symbol in pixels. Default value is `18`. */
   size?: Cx.NumberProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: Cx.NumberProp;

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: Cx.StringProp;

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: Cx.StringProp;

   /** Name of the item as it will appear in the legend. */
   name?: Cx.StringProp;

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: Cx.BooleanProp;

   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string;

   legendAction?: string;

   /** Size of the svg shape container in pixels. Default value is 20. */
   svgSize?: number;

   /**
    * Applies to rectangular shapes. The horizontal corner radius of the rect. Defaults to ry if ry is specified.
    * Value type: <length>|<percentage>;
    * If unit is not specified, it defaults to `px`.
    */
   rx?: Cx.StringProp | Cx.NumberProp;

   /**
    * Applies to rectangular shapes. The vertical corner radius of the rect. Defaults to rx if rx is specified.
    * Value type: <length>|<percentage>;
    * If unit is not specified, it defaults to `px`.
    */
   ry?: Cx.StringProp | Cx.NumberProp;

   /** Selection configuration. */
   selection?: Cx.Config;
}

export class LegendEntry extends Cx.Widget<LegendEntryProps> {}
