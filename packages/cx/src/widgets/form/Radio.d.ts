import * as Cx from '../../core';
import { FieldProps } from './Field';

interface RadioProps extends FieldProps {

   /** Selected value. If the value is equal to `option`, the radio button appears checked. */
   value?: Cx.Prop< number | string | boolean >,

   /** Selected value. If the value is equal to `option`, the radio button appears checked. */
   selection?: Cx.Prop< number | string | boolean >,

   /** Value to be written into `value` if radio button is clicked. */
   option?: Cx.Prop< number | string | boolean >,

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** Text description. */
   text?: Cx.StringProp,

   /** Base CSS class to be applied to the field. Defaults to `radio`. */
   baseClass?: string,

   /** 
    * Use native radio HTML element (`<input type="radio"/>`). 
    * Default is `false`. Native radio buttons are difficult to style.
    */
   native?: boolean,

   /**
    * Set to `true` to set the make the radio initially selected.
    */
   default?: boolean

}

export class Radio extends Cx.Widget<RadioProps> {}
