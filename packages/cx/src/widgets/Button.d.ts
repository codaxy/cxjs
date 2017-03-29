import * as Cx from '../core';
/**  */
interface ButtonProps extends Cx.HtmlElementProps {
   confirm?: string | object,
   disabled?: boolean,
   pressed?: boolean,
   icon?: string
}

export class Button extends Cx.Widget<any> {}
