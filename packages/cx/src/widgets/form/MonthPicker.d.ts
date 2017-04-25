import * as Cx from '../../core';
import { FieldProps } from './Field';

interface MonthPickerProps extends FieldProps {

   /** Set to `true` to allow range select. */
   range?: Cx.BooleanProp,

   /** 
    * Start of the selected month range. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `true`.
    */
   from?: Cx.StringProp | Cx.Prop<Date>,

   /** 
    * End of the selected month range. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `true`. 
    */
   to?: Cx.StringProp | Cx.Prop<Date>,

   /** 
    * Selected month date. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `false` (default).
    */
   value?: Cx.StringProp | Cx.Prop<Date>,

   /** View reference date. If no date is selected, this date is used to determine which month to show in the calendar. */
   refDate?: Cx.StringProp | Cx.Prop<Date>,

   /** Minimum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   minValue?: Cx.StringProp | Date,

   /** Minimum (exclusive) date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   minExclusive?: Cx.StringProp | Date,

   /** Maximum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxValue?: Cx.StringProp | Date,
   
   /** Maximum (exclusive) date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxExclusive?: Cx.StringProp | Date,
   
   /** Base CSS class to be applied on the field. Defaults to `monthfield`. */
   baseClass?: string,
   
   /** Minimum year available in the range. */
   startYear?: number,

   /** Max year available in the range. */
   endYear?: number,

   /** Number of years to be rendered in each render chunk. */
   bufferSize?: number,

   /** Maximum value error text. */
   maxValueErrorText?: string,

   /** Maximum exclusive value error text. */
   maxExclusiveErrorText?: string,

   /** Minimum value error text. */
   minValueErrorText?: string,

   /** Minimum exclusive value error text. */
   minExclusiveErrorText?: string,

}

export class MonthPicker extends Cx.Widget<MonthPickerProps> {}
