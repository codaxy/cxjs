import * as Cx from "../core";
import { BoundedObjectProps } from "../svg/BoundedObject";

interface PieLabelProps extends BoundedObjectProps {
   /** Distance in pixels, for which the labels will be separated from the pie chart. Default value is 100px. */
   distance: Cx.NumberProp;

   /**
    * Index of the color in the default color palette.
    */
   lineColorIndex?: Cx.NumberProp;

   /** A color used to paint the guideline. */
   lineStroke?: Cx.StringProp;

   /** CSS class applied to the line element. */
   lineClass?: Cx.StringProp;

   /** CSS style applied to the line element. */
   lineStyle?: Cx.StringProp;

   /** Base CSS class to be applied to the element. Defaults to `pielabel`. */
   baseClass?: string;
}

export class PieLabel extends Cx.Widget<PieLabelProps> {}
