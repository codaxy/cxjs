import * as Cx from '../../core';

export interface OverlayProps extends Cx.PureContainerProps, StyledContainerProps {
   
   /** Set to `true` to enable resizing. */
   resizable?: Cx.BooleanProp,

   /** Set to `true` to enable dragging the overlay. */
   draggable?: Cx.BooleanProp,

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

   autoFocus?: boolean,

   /** Set to `true` to append the set animate state after the initial render. Appended CSS class may be used to add show/hide animations. */
   animate?: boolean,

   /** Number of milliseconds to wait, before removing the element from the DOM. Used in combination with the animate property. */
   destroyDelay?: number,

   dismissOnFocusOut?: boolean,
   focusable?: boolean
}

export class Overlay extends Cx.Widget<OverlayProps> {}
