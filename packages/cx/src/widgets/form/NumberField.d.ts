import * as Cx from '../../core';
import { FieldProps } from './Field';

interface NumberFieldProps extends FieldProps {
   
   /** Value of the input. */
   value?: Cx.NumberProp,

   /** Defaults to false. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,
   
   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp, 

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** Template used to format the value. Examples: `ps` - percentage sign; `n;2` - two decimals. 
    * By default, number formatting is applied with optional maximum decimal precision. */
   format?: Cx.StringProp,

   /** Minimum number value. */
   minValue?: Cx.NumberProp,

   /** Set to `true` to disallow the `minValue`. Default value is `false`. */
   minExclusive?: Cx.BooleanProp,

   /** Maximum number value. */
   maxValue?: Cx.NumberProp,
   
   /** Set to `true` to disallow the `maxValue`. Default value is `false`. */
   maxExclusive?: Cx.BooleanProp,
   
   /** 
    * Percentage used to calculate the increment when it's not explicitly specified. 
    * Default value is `0.1` (10%).
    */
   incrementPercentage: Cx.NumberProp,

   /** Increment/decrement value when using arrow keys or mouse wheel. */
   increment: Cx.NumberProp,

   /** Increment/decrement value when using arrow keys or mouse wheel. */
   step: number,

   /** Base CSS class to be applied to the field. Defaults to `numberfield`. */
   baseClass?: string,
   
   /** Round values to the nearest tick. Default is `true`. */
   snapToIncrement?: boolean,

   /** Name of the icon to be put on the left side of the input. */
   icon?: string,

   /** Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property. Default value is `true`. */
   showClear?: boolean,

   /** Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property. Default value is `false`. */
   hideClear?: boolean,

   /**
    * Set to `true` to display the clear button even if `required` is set. Default is `false`.
    */
   alwaysShowClear?: boolean,

   /** Defaults to `input`. Other permitted values are `enter` and `blur`. Multiple values should be separated by space, .e.g. 'enter blur'. */
   reactOn?: string,
   
   /** Defaults to `text`. Other permitted value is `password`. */
   inputType?: "text" | "password",

   /** Maximum value error text. */
   maxValueErrorText?: string,

   /** Maximum exclusive value error text. */
   maxExclusiveErrorText?: string,

   /** Minimum value error text. */
   minValueErrorText?: string,

   /** Minimum exclusive value error text. */
   minExclusiveErrorText?: string,

   /** Invalid input error text. */
   inputErrorText?: string,

   /** A scale used to define mapping between displayed and stored values. E.g. 0.01 for percentages. DV = (SV - OFFSET) / SCALE */
   scale?: number,

   /** Offset to define mapping between displayed and stored values. DV = (SV - OFFSET) / SCALE */
   offset?: number,
}

export class NumberField extends Cx.Widget<any> {}
