import * as Cx from '../core';
import * as React from 'react';
import {Instance} from "../ui/Instance";
/**  */
interface ButtonProps extends Cx.HtmlElementProps {

   /** Confirmation text or configuration object. See MsgBox.yesNo for more details. */
   confirm?: Cx.Prop<string | Cx.Config>,

   /** Set to `true` to disable the button. */
   disabled?: Cx.BooleanProp,

   /** If true button appears in pressed state. Useful for implementing toggle buttons. */
   pressed?: Cx.BooleanProp,

   /** Name of the icon to be put on the left side of the button. */
   icon?: Cx.StringProp,

   /** Base CSS class to be applied to the element. Default is 'button'. */
   baseClass?: string,

   /** 
    * Determines if button should receive focus on mousedown event. 
    * Default is `false`, which means that focus can be set only using the keyboard `Tab` key. 
    */
   focusOnMouseDown?: boolean,

   /** Add type="submit" to the button. */
   submit?: boolean,

   onClick?: (e: React.SyntheticEvent<any>, instance: Instance) => void;
}

export class Button extends Cx.Widget<ButtonProps> {}
