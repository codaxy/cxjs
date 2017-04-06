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
   
   /** Base CSS class to be applied to the field. Defaults to `window`. */
   baseClass?: string,
   
   /** Set to `true` to enable resizing. */
   resizable?: boolean,
   /** Set to `true` to automatically focus the field, after it renders for the first time. */
   autoFocus?: boolean,
   
   focusable?: boolean

}

export class Window extends Cx.Widget<WindowProps> {}
