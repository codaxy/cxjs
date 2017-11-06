import * as Cx from '../../core';
import {BoundedObject, BoundedObjectProps} from '../../svg/BoundedObject';

export interface AxisProps extends BoundedObjectProps {
   
   /** Set to `true` for vertical axes. */
   vertical?: boolean,

   /** Used as a secondary axis. Displayed at the top/right. */
   secondary?: boolean,

   /** When set to `true`, the values are displayed in descending order. */
   inverted?: Cx.BooleanProp,

   /** When set to `true`, rendering of visual elements of the axis, such as ticks and labels, is skipped, but their function is preserved. */
   hidden?: boolean,

   tickSize?: number,
   minTickDistance?: number,
   minLabelDistanceVertical?: number,
   minLabelDistanceHorizontal?: number,
   
   /** Distance between labels and the axis. */
   labelOffset?: number | string,

   /** Label rotation angle in degrees. */
   labelRotation?: Cx.Prop<number | string>,

   /** Label text-anchor value. Allowed values are start, end and middle. Default value is set based on the value of vertical and secondary flags. */
   labelAnchor?: 'start' | 'end' | 'middle' | 'auto',

   /** Horizontal text offset. */
   labelDx?: number | string,

   /** Vertical text offset which can be used for vertical alignment. */
   labelDy?: number | string, 

   /** Set to `true` to break long labels into multiple lines. Default value is `false`. Text is split at space characters. See also `labelMaxLineLength` and `labelLineCountDyFactor`. */
   labelWrap?: boolean,

   /**
    * Used for vertical adjustment of multi-line labels. Default value is `auto` which means 
    * that value is initialized based on axis configuration. Value `0` means that label will grow towards
    * the bottom of the screen. Value `-1` will make labels to grow towards the top of the screen. 
    * `-0.5` will make labels vertically centered.
    */
   labelLineCountDyFactor?: number | string,

   /** If `labelWrap` is on, this number is used as a measure to split labels into multiple lines. Default value is `10`. */
   labelMaxLineLength?: number,

   /** Set to true to hide axis labels */
   hideLabels?: boolean,

}

export class Axis extends BoundedObject {}