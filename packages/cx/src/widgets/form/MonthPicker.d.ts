import * as Cx from "../../core";
import { Instance } from "../../ui";
import { FieldProps } from "./Field";

interface MonthPickerProps extends FieldProps {
   /** Set to `true` to allow range select. */
   range?: Cx.BooleanProp;

   /**
    * Start of the selected month range. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `true`.
    */
   from?: Cx.Prop<string | Date>;

   /**
    * End of the selected month range. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `true`.
    */
   to?: Cx.Prop<string | Date>;

   /**
    * Selected month date. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `false` (default).
    */
   value?: Cx.Prop<string | Date>;

   /** View reference date. If no date is selected, this date is used to determine which month to show in the calendar. */
   refDate?: Cx.Prop<string | Date>;

   /** Minimum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   minValue?: Cx.Prop<string | Date>;

   /** Set to `true` to disallow the `minValue`. Default value is `false`. */
   minExclusive?: Cx.BooleanProp;

   /** Maximum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxValue?: Cx.Prop<string | Date>;

   /** Set to `true` to disallow the `maxValue`. Default value is `false`. */
   maxExclusive?: Cx.BooleanProp;

   /** Base CSS class to be applied on the field. Defaults to `monthfield`. */
   baseClass?: string;

   /** Minimum year available in the range. */
   startYear?: number;

   /** Max year available in the range. */
   endYear?: number;

   /** Number of years to be rendered in each render chunk. */
   bufferSize?: number;

   /** Maximum value error text. */
   maxValueErrorText?: string;

   /** Maximum exclusive value error text. */
   maxExclusiveErrorText?: string;

   /** Minimum value error text. */
   minValueErrorText?: string;

   /** Minimum exclusive value error text. */
   minExclusiveErrorText?: string;

   /** The function that will be used to convert Date objects before writing data to the store.
    * Default implementation is Date.toISOString.
    * See also Culture.setDefaultDateEncoding.
    */
   encoding?: (date: Date) => any;

   /** A boolean flag that determines whether the `to` date is included in the range.
    * When set to true the value stored in the to field would be the last day of the month, i.e. `2024-12-31`. */
   inclusiveTo?: boolean;

   /** Callback function that is called before writing data to the store. Return false to short-circuit updating the state. */
   onBeforeSelect: (e: Event, instance: Instance, dateFrom?: Date, dateTo?: Date) => boolean;

   /** Callback function that is called after value or date range has changed */
   onSelect: (instance: Instance, dateFrom?: Date, dateTo?: Date) => void;

   /**
    * Optional parameter to hide the quarters period section on the picker.
    * When true, the quarters section will not render.
    */
   hideQuarters?: boolean;

   /**
    * Callback to create a function that determines if a date is selectable.
    * Return `false` on factory method to disable specific month, quarter or a whole year.
    *
    * Note: Use the `onValidate` callback for validation purposes.
    */
   onCreateIsMonthDateSelectable?: (validationParams: Cx.Config, instance: Instance) => (monthDate: Date) => boolean;
}

export class MonthPicker extends Cx.Widget<MonthPickerProps> {}
