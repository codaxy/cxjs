import { Instance } from "./../../ui/Instance.d";
import * as Cx from "../../core";
import { BoundedObject, BoundedObjectProps } from "../../svg/BoundedObject";

export interface AxisProps extends BoundedObjectProps {
   /** Set to `true` for vertical axes. */
   vertical?: boolean;

   /** Used as a secondary axis. Displayed at the top/right. */
   secondary?: boolean;

   /** When set to `true`, the values are displayed in descending order. */
   inverted?: Cx.BooleanProp;

   /** When set to `true`, rendering of visual elements of the axis, such as ticks and labels, is skipped, but their function is preserved. */
   hidden?: boolean;

   /** Size of the axis tick line. Defaults to 3. */
   tickSize?: number;

   /** Distance between ticks and the axis. Default is 0. Use negative values for offset to make ticks appear on both sides of the axis. */
   tickOffset?: number;

   /** The smallest distance between two ticks on the axis. Defaults to 25. */
   minTickDistance?: number;

   /** The smallest distance between two labels on the vertical axis. Defaults to 40. */
   minLabelDistanceVertical?: number;

   /** The smallest distance between two labels on the horizontal axis. Defaults to 50.  */
   minLabelDistanceHorizontal?: number;

   /** Distance between labels and the axis. Defaults to 10. */
   labelOffset?: number | string;

   /** Label rotation angle in degrees. */
   labelRotation?: Cx.Prop<number | string>;

   /** Label text-anchor value. Allowed values are start, end and middle. Default value is set based on the value of vertical and secondary flags. */
   labelAnchor?: "start" | "end" | "middle" | "auto";

   /** Horizontal text offset. */
   labelDx?: number | string;

   /** Vertical text offset which can be used for vertical alignment. */
   labelDy?: number | string;

   /** Set to `true` to break long labels into multiple lines. Default value is `false`. Text is split at space characters. See also `labelMaxLineLength` and `labelLineCountDyFactor`. */
   labelWrap?: boolean;

   /**
    * Used for vertical adjustment of multi-line labels. Default value is `auto` which means
    * that value is initialized based on axis configuration. Value `0` means that label will grow towards
    * the bottom of the screen. Value `-1` will make labels to grow towards the top of the screen.
    * `-0.5` will make labels vertically centered.
    */
   labelLineCountDyFactor?: number | string;

   /**
    * Used for vertical adjustment of multi-line labels. Default value is 1 which means
    * that labels are stacked without any space between them. Value of 1.4 will add 40% of the label height as a space between labels.
    */
   labelLineHeight?: number | string;

   /** If `labelWrap` is on, this number is used as a measure to split labels into multiple lines. Default value is `10`. */
   labelMaxLineLength?: number;

   /** Set to true to hide the axis labels. */
   hideLabels?: boolean;

   /** Set to true to hide the axis line. */
   hideLine?: boolean;

   /** Set to true to hide the axis ticks. */
   hideTicks?: boolean;

   /** Additional CSS style to be applied to the axis line. */
   lineStyle?: Cx.StyleProp;

   /** Additional CSS style to be applied to the axis ticks. */
   tickStyle?: Cx.StyleProp;

   /** Additional CSS style to be applied to the axis labels. */
   labelStyle?: Cx.StyleProp;

   /** Additional CSS class to be applied to the axis line. */
   lineClass?: Cx.ClassProp;

   /** Additional CSS class to be applied to the axis ticks. */
   tickClass?: Cx.ClassProp;

   /** Additional CSS class to be applied to the axis labels. */
   labelClass?: Cx.ClassProp;

   onMeasured?: (info: any, instance: Instance) => void;

   /** A function used to create a formatter function for axis labels. See Complex Labels example in the CxJS documentation for more info. */
   onCreateLabelFormatter?:
      | string
      | ((
           context: any,
           instance: Instance,
        ) => (
           formattedValue: string,
           value: any,
           { tickIndex, serieIndex }: { tickIndex: number; serieIndex: number },
        ) => { text: string; style?: any; className?: string }[]);

   /** Distance between the even labels and the axis. */
   alternateLabelOffset?: number | string;
}

export class Axis extends BoundedObject {}
