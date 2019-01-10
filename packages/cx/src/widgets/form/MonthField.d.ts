import * as Cx from '../../core';
import { FieldProps } from './Field';

interface MonthFieldProps extends FieldProps {
   
   /** Selected month. This should be a Date object or a valid date string consumable by Date.parse function. */
   value?: Cx.Prop< string | Date >,
   
   /** Set to `true` to allow range select. */
   range?: Cx.BooleanProp,

   /** 
    * Start of the selected month range. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `true`.
    */
   from?: Cx.Prop< string | Date >,

   /** 
    * End of the selected month range. This should be a Date object or a valid date string consumable by Date.parse function.
    * Used only if `range` is set to `true`. 
    */
   to?: Cx.Prop< string | Date >,

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp,

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** Minimum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   minValue?: Cx.Prop< string | Date >,

   /** Set to `true` to disallow the `minValue`. Default value is `false`. */
   minExclusive?: Cx.BooleanProp,

   /** Maximum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxValue?: Cx.Prop< string | Date >,
   
   /** Set to `true` to disallow the `maxValue`. Default value is `false`. */
   maxExclusive?: Cx.BooleanProp,

   /** String representing culture. Default is `en` */
   culture?: string,

   /** 
    * Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property. 
    * Default value is `false`. 
    */
   hideClear?: boolean,

   /** Base CSS class to be applied on the field. Defaults to `monthfield`. */
   baseClass?: string,

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

   /** Name of the icon to be put on the left side of the input. */
   icon?: string,

   /** 
    * Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property. 
    * Default value is `true`. 
    */
   showClear?: boolean,

   /**
    * Set to `true` to display the clear button even if `required` is set. Default is `false`.
    */
   alwaysShowClear?: boolean,

}

export class MonthField extends Cx.Widget<MonthFieldProps> {}
