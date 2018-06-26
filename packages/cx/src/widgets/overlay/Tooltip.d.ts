import * as Cx from '../../core';
import { DropdownProps } from './Dropdown';

interface TooltipProps extends DropdownProps {

   /** Text to be displayed inside the tooltip. */
   text?: Cx.StringProp,

   /** Text to be displayed in the header. */
   title?: Cx.StringProp,

   /** 
    * Set to true to make the tooltip always visible. 
    * This is useful e.g. in product tours, when instructions need to be shown, even if the mouse pointer is not around. 
    */
   alwaysVisible?: Cx.BooleanProp,
   
   /** Base CSS class to be applied to the field. Defaults to 'tooltip'. */
   baseClass?: string,

   /** 
    * Set to `true` to append the set `animate` state after the initial render.
    *  Appended CSS class may be used to add show/hide animations.
    */
   animate?: boolean,
   
   /** Set to `true` to make the tooltip follow the mouse movement. */
   trackMouse?: boolean,

   trackMouseX?: boolean,
   trackMouseY?: boolean,

   /** 
    * This property controls how tooltips behave on touch events. 
    * Default value is `toggle` which means that the tooltip is shown on first tap and closed on the second tap. 
    * Use `ignore` to skip showing tooltips on touch events. 
    */
   touchBehavior?: string,


   /**
    * Set to true to rely on browser's window mousemove event for getting mouse coordinates
    * instead of using the element that tooltip is attached to.
    */
   globalMouseTracking?: boolean
}

export class Tooltip extends Cx.Widget<TooltipProps> {}

export function enableTooltips();
