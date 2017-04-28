import * as Cx from '../core';

interface CxCreditProps extends Cx.HtmlElementProps {
   
   /** Base CSS class to be applied to the element. Defaults to `cxcredit`. */
   baseClass?: string,
   /** HTML tag to be used. Default is `div`. */
   tag?: string

}

export class CxCredit extends Cx.Widget<CxCreditProps> {}
