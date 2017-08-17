import * as Cx from '../../core';
import { FieldProps } from './Field';

interface ColorFieldProps extends FieldProps {

   /** Either `rgba`, `hsla` or `hex` value of the selected color. */
   value?: Cx.StringProp,

   /** Defaults to `false`. Used to make the field read-only. */
   readOnly?: Cx.BooleanProp,

   /** The opposite of `disabled`. */
   enabled?: Cx.BooleanProp,

   /** Default text displayed when the field is empty. */
   placeholder?: Cx.StringProp,

   /** 
    * Set to `true` to hide the clear button. 
    * It can be used interchangeably with the `showClear` property. Default value is `false`.
    */
   hideClear?: boolean,
   
   /** 
    * Set to `false` to hide the clear button. 
    * It can be used interchangeably with the `hideClear` property. Default value is `true`.
    */
   showClear?: boolean,

   /**
    * Set to `true` to display the clear button even if `required` is set. Default is `false`.
    */
   alwaysShowClear?: boolean,
   
   /** Base CSS class to be applied to the element. Defaults to `colorfield`. */
   baseClass?: boolean,

   /** Format of the color representation. Either `rgba`, `hsla` or `hex`. */
   format?: "rgba" | "hsla" | "hex"

}

export class ColorField extends Cx.Widget<ColorFieldProps> {}
