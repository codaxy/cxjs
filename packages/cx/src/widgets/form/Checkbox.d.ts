import * as Cx from '../../core';

interface CheckboxProps extends {

   /** Value of the checkbox. `true` makes the checkbox checked. */
   value?: Cx.BooleanProp,

   /** efaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Defaults to `false`. Used to make the field required. */
   required?: Cx.BooleanProp,

   /** Base CSS class to be applied to the field. Defaults to `checkbox`. */
   baseClass?: string,

   /** 
    * Use native checkbox HTML element (`<input type="checkbox"/>`). Default is `false`. 
    *  Native checkboxes are difficult to style. 
    */
   native?: boolean,

   /** 
    * Set to true to instruct the widget to indicate indeterminate state 
    * (null or undefined value) with a square icon instead of appearing unchecked. 
    */
   indeterminate?: boolean
}

export class Checkbox extends Cx.Widget<CheckboxProps> {}
