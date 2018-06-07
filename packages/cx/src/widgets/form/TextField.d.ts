import * as Cx from '../../core';
import { FieldProps } from './Field';

export interface TextFieldProps extends FieldProps {

   /** 
    * Set to `true` to hide the clear button. It can be used interchangeably with the `showClear` property. 
    * Default value is `true`. 
    */
   hideClear?: boolean,

   /** 
    * Set to `false` to hide the clear button. It can be used interchangeably with the `hideClear` property. 
    * Default value is `false`. 
    */
   showClear?: boolean,

   /**
    * Set to `true` to display the clear button even if `required` is set. Default is `false`.
    */
   alwaysShowClear?: boolean,

   /** Textual value of the input. */
   value?: Cx.StringProp,

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp,

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** Minimal length of the input text. */
   minLength?: Cx.NumberProp,
   
   /** Maximal length of the input text. */
   maxLength?: Cx.NumberProp,

   /** Base CSS class to be applied to the field. Defaults to `textfield`. */
   baseClass?: string,

   /** 
    * Event used to report a new value. Defaults to `input`, which means that entered value will be written to the store on each keystroke. 
    * Other permitted values are `enter` (Enter key pressed) and `blur` (field looses focus). 
    * Multiple values should be separated by space, e.g. `enter blur`. 
    */
   reactOn?: string,

   /** Defaults to `text`. Other permitted value is `password`. */
   inputType?: "text" | "password",

   /** Message to be shown to the user if validation fails. */
   validationErrorText?: string,
   
   /** Message to be shown to the user if input text is too short. */
   minLengthValidationErrorText?: string,
   
   /** Message to be shown to the user if input text is too long. */
   maxLengthValidationErrorText?: string,

   /** Regular expression used to validate the user's input. */
   validationRegExp?: RegExp,
   
   /** Name of the icon to be put on the left side of the input. */
   icon?: Cx.StringProp
}

export class TextField extends Cx.Widget<TextFieldProps> {}
