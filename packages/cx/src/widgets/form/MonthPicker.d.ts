import * as Cx from '../../core';
import { FieldProps } from './Field';

interface MonthPickerProps extends FieldProps {

   /** Either `view` or `edit` (default). In view mode, the field is displayed as plain text. */
   mode?: Cx.Prop< "view" | "edit">,

   /** Set to `true` to allow range select. */
   range?: Cx.BooleanProp,

   /** 
    * Start of the selected month range. This should be a valid date string consumable by `Date.parse` function.
    * Used only if `range` is set to `true`.
    */
   from?: Cx.StringProp,

   /** 
    * End of the selected month range. This should be a valid date string consumable by `Date.parse` function.
    * Used only if `range` is set to `true`. 
    */
   to?: Cx.StringProp,

   /** 
    * Selected month date. This should be a valid date string consumable by `Date.parse` function.
    * Used only if `range` is set to `false` (default).
    */
   value?: Cx.StringProp,

   refData?:

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   minValue?:
   minExclusive?:
   maxValue?:
   maxExclusive?:
   
   /** Base CSS class to be applied on the field. Defaults to `monthfield`. */
   baseClass?: string,
   startYear?: number,
   endYear?: number,
   bufferSize?: number,
   maxValueErrorText?: string,
   maxExclusiveErrorText?: string,
   minValueErrorText?: string,
   minExclusiveErrorText?: string
}

export class MonthPicker extends Cx.Widget<MonthPickerProps> {}
