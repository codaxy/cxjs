import * as Cx from '../../core';
import { FieldProps } from './Field';

interface CheckboxProps extends FieldProps {

   /** Value of the checkbox. `true` makes the checkbox checked. */
   value?: Cx.BooleanProp,

   /** efaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** Base CSS class to be applied to the field. Defaults to `checkbox`. */
   baseClass?: string,

   /** 
    * Use native checkbox HTML element (`<input type="checkbox"/>`). Default is `false`. 
    * Native checkboxes are difficult to style. 
    */
   native?: boolean,

   /** 
    * Set to true to instruct the widget to indicate indeterminate state 
    * (null or undefined value) with a square icon instead of appearing unchecked. 
    */
   indeterminate?: boolean,

   /** Value of the checkbox. `true` makes the checkbox checked. */
   checked?: Cx.BooleanProp,

   /** Text property. */
   text?: Cx.StringProp,

   /** Prevent moving focus on the checkbox. This is useful when checkboxes are found
    inside other focusable elements, such as grids or lists. */
   unfocusable?: boolean
    
}

export class Checkbox extends Cx.Widget<CheckboxProps> {}
