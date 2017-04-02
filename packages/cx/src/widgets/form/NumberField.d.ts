import * as Cx from '../../core';
import { FieldProps } from './Field';

interface NumberFieldProps extends FieldProps {
   
   /** Value of the input. */
   value?: Cx.NumberProp,

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Defaults to false. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,
   
   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp, 

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** Defaults to `false`. Used to make the field required. */
   required?: Cx.BooleanProp,

   /** Template used to format the value. Examples: `ps` - percentage sign; `n;2` - two decimals. 
    * By default, number formatting is applied with optional maximum decimal precision. */
   format?: Cx.StringProp,

   /** Minimum number value. */
   minValue?: Cx.NumberProp,

   /** Minimum (exclusive) number value. */
   minExclusive?: Cx.NumberProp,

   /** Maximum number value. */
   maxValue?: Cx.NumberProp,
   
   /** Maximum (exclusive) number value. */
   maxExclusive?: Cx.NumberProp,

   incrementPercentage: Cx.NumberProp,
   increment: Cx.NumberProp,
   step: Cx.NumberProp,   // is step bindable since it is an alias for increments and it is not defined in declareData method

   /** Base CSS class to be applied to the field. Defaults to `numberfield`. */
   baseClass?: string,

   suppressErrorTooltipsUntilVisited?: boolean,
   snapToIncrement?: boolean,

   /** Name of the icon to be put on the left side of the input. */
   icon?: string,

   /** Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property. Default value is `true`. */
   showClear?: boolean,

   /** Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property. Default value is `false`. */
   hideClear?: boolean

}

export class NumberField extends Cx.Widget<any> {}
