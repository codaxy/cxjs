import * as Cx from '../../core';
import { FieldProps } from './Field';

interface ColorPickerProps extends FieldProps {

   /** Either `rgba`, `hsla` or `hex` value of the selected color. */
   value?: Cx.StringProp,
   
   /** Base CSS class to be applied to the element. Defaults to `colorpicker`. */
   baseClass?: string,
   reportOn?: string,

   /** Format of the color representation. Either `rgba`, `hsla` or `hex`. */
   format?: "rgba" | "hsla" | "hex"
   
}

export class ColorPicker extends Cx.Widget<ColorPickerProps> {}
