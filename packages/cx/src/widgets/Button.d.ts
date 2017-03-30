import * as Cx from '../core';
import * as React from 'react';
import {Instance} from "../ui/Instance";
/**  */
interface ButtonProps extends Cx.HtmlElementProps {
   confirm?: Cx.Prop<string | Cx.Config>,
   disabled?: Cx.BooleanProp,
   pressed?: Cx.BooleanProp,
   icon?: Cx.StringProp,
   baseClass?: string,
   focusOnMouseDown?: boolean,
   submit?: boolean,

   onClick?: (e: React.SyntheticEvent<any>, instance: Instance) => void;
}

export class Button extends Cx.Widget<ButtonProps> {}
