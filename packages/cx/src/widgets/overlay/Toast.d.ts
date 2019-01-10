import * as Cx from '../../core';
import { OverlayProps } from './Overlay';

interface ToastProps extends OverlayProps {

   /** Value of timeout in milliseconds after which the toast is automatically dismissed. */
   timeout?: Cx.NumberProp,
   
   message?: string,

   /** List of child elements. */
   items?: Cx.RecordsProp,

   /** Add default padding. Default is `true`. */
   pad?: boolean,
   
   /** Base CSS class. Default is `toast`. */
   baseClass?: string,

   /** 
    * Defines where the toast will be placed. 
    * Supported values are `top`, `right`, `bottom` and `left`. Default value is `top`. 
    */
   placement?: string,

   styled?: boolean
   
}

export class Toast extends Cx.Widget<ToastProps> {}
