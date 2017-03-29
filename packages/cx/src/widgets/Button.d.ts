import * as Cx from '../core';
/**  */
interface ButtonProps extends Cx.HtmlElementProps {
   confirm?: Cx.Prop<string | object>,
   disabled?: boolean,
   pressed?: Cx.BooleanProp,
   icon?: Cx.StringProp,
   baseClass?: string,
   focusOnMouseDown: boolean,
   submit: boolean
}

export class Button extends Cx.Widget<ButtonProps> {}
