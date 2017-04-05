import * as Cx from '../../core';
import { OverlayProps } from './Overlay';

interface ToastProps extends OverlayProps {

   /** Value of timeout in milliseconds after which the toast is automatically dismissed. */
   timeout?: Cx.NumberProp,
   
   message?: Cx.StringProp,

   /** List of child elements. */
   items?: Cx.RecordsProp,

   /** Add default padding. Default is `true`. */
   pad?: boolean,

   /** 
    * Defines where the toast will be placed. 
    * Supported values are `top`, `right`, `bottom` and `left`. Default value is `top`. 
    */
   placement?: string,
   
   /** 
    * Number of milliseconds to wait, before removing the element from the DOM. 
    * Used in combination with the `animate` property. 
    */
   destroyDelay?: number
}

export class Toast extends Cx.Widget<ToastProps> {}
