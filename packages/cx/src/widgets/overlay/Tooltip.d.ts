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
   
   /** 
    * Set to `true` to append the set `animate` state after the initial render.
    *  Appended CSS class may be used to add show/hide animations.
    */
   animate?: boolean,
   
   /** 
    * Number of milliseconds to wait, before removing the element from the DOM.
    * Used in combination with the `animate` property. 
    */
   destroyDelay?: number,
   
   /** Set to `true` to make the tooltip follow the mouse movement. */
   trackMouse?: string, 

   /** 
    * This property controls how tooltips behave on touch events. 
    * Default value is `toggle` which means that the tooltip is shown on first tap and closed on the second tap. 
    * Use `ignore` to skip showing tooltips on touch events. 
    */
   touchBehavior?: string,
}

export class Tooltip extends Cx.Widget<TooltipProps> {}
