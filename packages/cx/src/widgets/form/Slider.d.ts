import * as Cx from '../../core';
import { FieldProps } from './Field';

interface SliderProps extends FieldProps {

   /** Low value of the slider range. */
   from?: Cx.NumberProp,

   /** High value of the slider range. */
   to?: Cx.NumberProp,

   /** Rounding step. */
   step?: Cx.NumberProp,

   /** Minimum allowed value. Default is `0`. */
   minValue?: Cx.NumberProp,

   /** Maximum allowed value. Default is `100`. */
   maxValue?: Cx.NumberProp,

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** Style object to be applied on the selected axis range. */
   rangeStyle?: Cx.StyleProp,

   /** Style object to be applied on the handle. */
   handleStyle?: Cx.StyleProp,

   /** Minimum allowed value. Default is `0`. */
   min?: Cx.NumberProp,

   /** Maximum allowed value. Default is `100`. */
   max?: Cx.NumberProp,
   
   /** High value of the slider range. */
   value?: Cx.NumberProp,

   /** Base CSS class to be applied to the field. Defaults to `slider`. */
   baseClass?: string,

   /** Set to `true` to orient the slider vertically. */
   vertical?: boolean,

   /* TODO: Check type */
   showTo?: any,
   showFrom?: any

}

export class Slider extends Cx.Widget<SliderProps> {}
