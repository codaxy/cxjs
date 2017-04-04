import * as Cx from '../../core';
import { FieldProps } from './Field';

interface MonthFieldProps extends FieldProps {
   
   /** Set to `true` to allow range select. */
   range?: Cx.BooleanProp,

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp,

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** Defaults to `false`. Used to make the field required. */
   required?: Cx.BooleanProp,

   /** Minimum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   minValue?: Cx.Prop< string | Date >,

   /** Minimum (exclusive) date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   minExclusive?: Cx.Prop< string | Date >,

   /** Maximum date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxValue?: Cx.Prop< string | Date >,
   
   /** Maximum (exclusive) date value. This should be a Date object or a valid date string consumable by Date.parse function. */
   maxExclusive?: Cx.Prop< string | Date >,

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

   /** When `true`, error tooltips are suppressed until the field has been visited. Default value is `true`. */
   suppressErrorTooltipsUntilVisited?: boolean,

   /** Name of the icon to be put on the left side of the input. */
   icon?: string,

   /** 
    * Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property. 
    * Default value is `true`. 
    */
   showClear?: boolean
}

export class MonthField extends Cx.Widget<MonthFieldProps> {}
