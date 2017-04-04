import * as Cx from '../../core';
import { FieldProps } from './Field';

interface ColorFieldProps extends FieldProps {

   /** Either `rgba`, `hsla` or `hex` value of the selected color. */
   value?: Cx.Prop< "rgba" | "hsla" | "hex">,

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

   baseClass?: boolean,

   /** Format of the color representation. Either `rgba`, `hsla` or `hex`. */
   format?: "rgba" | "hsla" | "hex",

   suppressErrorTooltipsUnitVisited?: boolean
}

export class ColorField extends Cx.Widget<ColorFieldProps> {}
