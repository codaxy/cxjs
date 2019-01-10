import * as Cx from '../../core';
import { FieldProps } from './Field';

interface SelectProps extends FieldProps {

   /** Select value. */
   value?: Cx.Prop<number | string>,

   /** Value when no selection is made. Default is `undefined` */
   emptyValue?: any,

   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp,

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,
   
   /** 
    * Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property. Default value is `false`. 
    * Note, the `placeholder` needs to be specified for the clear button to render. 
    */
   hideClear?: boolean,
   
   /**
    * Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property. Default value is `true`. 
    * Note, the `placeholder` needs to be specified for the clear button to render. 
    */
   showClear?: boolean,

   /**
    * Set to `true` to display the clear button even if `required` is set. Default is `false`.
    */
   alwaysShowClear?: boolean,
   
   /** Base CSS class to be applied to the element. Defaults to `select`. */
   baseClass?: string,

   /** Defaults to `false`. Set to `true` to enable multiple selection. */
   multiple?: boolean,

   /** 
    * Convert values before selection. 
    * Useful for converting strings into numbers. Default is `true`. 
    */
   convertValues?: boolean,
   
   /** String value used to indicate a `null` entry */
   nullString?: string,
   
   /** Name of the icon to be put on the left side of the input. */
   icon?: string

}

export class Select extends Cx.Widget<SelectProps> {}

interface OptionProps extends Cx.HtmlElementProps {
   
   /** Value property. */
   value?: Cx.StringProp,

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp,

   /** Defaults to `false`. Set to `true` to select the the option. */
   selected?: Cx.BooleanProp,

}

export class Option extends Cx.Widget<OptionProps> {}
