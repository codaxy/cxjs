import * as Cx from '../core';

interface CxCreditProps extends Cx.HtmlElementProps{
   baseClass?: string,
   tag?: string
}

export class CxCredit extends Cx.Widget<CxCreditProps> {}
