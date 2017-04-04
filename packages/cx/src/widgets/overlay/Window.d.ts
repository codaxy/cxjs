import * as Cx from '../../core';
import { OverlayProps } from './Overlay';

interface WindowProps extends OverlayProps {

   /** Text to be displayed in the header. */
   title?: Cx.StringProp,

   /** Controls the close button visibility. Defaults to `true`. */
   closeable?: Cx.BooleanProp,

   /** A custom style which will be applied to the body. */
   bodyStyle?: Cx.StyleProp,

   /** A custom style which will be applied to the header. */
   headerStyle?: Cx.StyleProp,

   /** A custom style which will be applied to the footer. */
   footerStyle?: Cx.StyleProp
}

export class Window extends Cx.Widget<WindowProps> {}
