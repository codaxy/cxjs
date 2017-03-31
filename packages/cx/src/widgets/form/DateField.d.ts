import * as Cx from '../../core';
import { FieldProps } from './Field';

interface DateFieldProps extends FieldProps {
   
   /** Selected datee. This should be a valid date string consumable by Date.parse function. */
   value?: Cx.StringProp | Date,

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Defaults to false. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,
   
   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp, 

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** Defaults to `false`. Used to make the field required. */
   required?: Cx.StringProp,

   /** Minimum date value. This should be a valid date string consumable by Date.parse function. */
   minValue?: Cx.StringProp | Date,

   /** Minimum (exclusive) date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   minExclusive?: Cx.StringProp | Date,

   /** Maximum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxValue?: Cx.StringProp | Date,
   
   /** Maximum (exclusive) date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxExclusive?: Cx.StringProp | Date,
   
   /** Date format used to display the selected date. See Formatting for more details. */
   format?: Cx.StringProp,

   /** Base CSS class to be applied to the field. Defaults to `datefield`. */
   baseClass?: string,

   memoize?: boolean,
   suppressErrorTooltipsUntilVisited?: boolean,

   /** Name of the icon to be put on the left side of the input. */
   icon?: string,

   /** Set to false to hide the clear button. It can be used interchangeably with the hideClear property. Default value is true. */
   showClear?: boolean,

   /** Set to true to hide the clear button. It can be used interchangeably with the showClear property. Default value is false. */
   hideClear?: boolean
}

export class DateField extends Cx.Widget<DateFieldProps> {}
