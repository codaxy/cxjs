import * as Cx from '../../core';
import { Instance } from "../../ui/Instance";

export interface OverlayProps extends Cx.StyledContainerProps {

   /** Set to `true` to enable resizing. */
   resizable?: Cx.BooleanProp,

   /** Set to `true` to enable dragging the overlay. */
   draggable?: Cx.BooleanProp,

   /** Base CSS class to be applied to the field. Defaults to `overlay`. */
   baseClass?: string,

   resizeWidth?: number,

   /** Set to `true` to initially place the overlay in the center of the page. */
   center?: boolean,

   /** Set to `true` to add a modal backdrop which masks mouse events for the rest of the page. */
   modal?: boolean,

   /** Set to `true` to add a modal backdrop which will dismiss the window when clicked. */
   backdrop?: boolean,

   /** Set to `true` to force the element to be rendered inline, instead of being appended to the body element.
    * Inline overlays have z-index set to a very high value, to ensure they are displayed on top of the other content. */
   inline?: boolean,

   /** Set to `true` to automatically focus the top level overlay element. */
   autoFocus?: boolean,

   /** Set to `true` to automatically focus the first focusable child in the overlay. */
   autoFocusFirstChild?: boolean,

   /** Set to `true` to append the set animate state after the initial render. Appended CSS class may be used to add show/hide animations. */
   animate?: boolean,

   /** Number of milliseconds to wait, before removing the element from the DOM. Used in combination with the animate property. */
   destroyDelay?: number,

   /** Automatically dismiss overlay if it loses focus. */
   dismissOnFocusOut?: boolean,

   /** Set to true to make the top level overlay element focusable. */
   focusable?: boolean,

   /** A callback function which fires while the overlay is being moved around. */
   onMove?(e: Event, instance: Instance, component: any);

   /** A callback function which fires while the overlay is being resized. */
   onResize?(e: Event, instance: Instance, component: any);
}

export class Overlay extends Cx.Widget<OverlayProps> {}
