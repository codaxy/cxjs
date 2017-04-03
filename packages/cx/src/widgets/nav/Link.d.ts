import * as Cx from '../../core';

interface LinkProps extends Cx.HtmlElementProps{

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Target url. */
   href?: Cx.StringProp,

   text?: Cx.StringProp,
   url?: Cx.StringProp,
   baseClass?: string,
   match?: "equal" | "prefix"
   

}

export class Link extends Cx.Widget<LinkProps> {}
