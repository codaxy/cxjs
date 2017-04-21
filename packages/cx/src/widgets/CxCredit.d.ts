import * as Cx from '../core';

interface CxCreditProps extends Cx.HtmlElementProps {
   
   // TODO: Check type
   tooltip?: any,
   baseClass?: string,
   tag?: string

}

export class CxCredit extends Cx.Widget<CxCreditProps> {}
