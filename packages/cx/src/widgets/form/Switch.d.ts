import * as Cx from '../../core';
import { FieldProps } from './Field';

interface SwitchProps extends FieldProps {

   /** Value indicating that switch is on. */
   on?: Cx.BooleanProp,

   /** Value indicating that switch is off. */
   off?: Cx.BooleanProp,
   
   /** Value indicating that switch is on. */
   value?: Cx.BooleanProp,

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** Text description. */
   text?: Cx.StringProp,

   /** Style object to be applied on the axis range when the switch is on. */
   rangeStyle?: Cx.StyleProp,
   
   /** Style object to be applied on the switch handle. */
   handleStyle?: Cx.StyleProp,

   /** Base CSS class to be applied to the field. Defaults to `switch`. */
   baseClass?: string,
   
   /** 
    * Determines if button should receive focus on mousedown event. 
    * Default is `false`, which means that focus can be set only using the keyboard `Tab` key. 
    */
   focusOnMouseDown?: boolean
   
}

export class Switch extends Cx.Widget<SwitchProps> {}
