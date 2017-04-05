import * as Cx from '../../core';
import { FieldProps } from './Field';

interface CalendarProps extends FieldProps {
   
   /** Selected date. This should be a `Date` object or a valid date string consumable by `Date.parse` function. */
   value?: Cx.StringProp | Cx.Prop<Date>,

   /** View reference date. If no date is selected, this date is used to determine which month to show in the calendar. */
   refDate?: Cx.StringProp | Cx.Prop<Date>,
 
   /** Minimum date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function. */
   minValue?: Cx.StringProp | Cx.Prop<Date>,

   /** Minimum (exclusive) date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function. */
   minExclusive?: Cx.StringProp | Cx.Prop<Date>,
   
   /** Maximum date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function. */
   maxValue?: Cx.StringProp | Cx.Prop<Date>,

   /** Maximum (exclusive) date value. This should be a `Date` object or a valid date string consumable by `Date.parse` function. */
   maxExclusive?: Cx.StringProp | Cx.Prop<Date>,

   /** Base CSS class to be applied to the calendar. Defaults to `calendar`. */
   baseClass?: string,

   /** Highlight today's date. Default is true. */
   highlightToday?: boolean,

   /** Maximum value error text. */
   maxValueErrorText?: string,

   /** Maximum exclusive value error text. */
   maxExclusiveErrorText?: string,

   /** Minimum value error text. */
   minValueErrorText?: string,

   /** Minimum exclusive value error text. */
   minExclusiveErrorText?: string
   
}

export class Calendar extends Cx.Widget<CalendarProps> {}
