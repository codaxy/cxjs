import * as Cx from '../../core';

interface LinkProp extends Cx.HtmlElementProps{

   /** Defaults to `false`. Set to `true` to disable the field. */
   disabled?: Cx.BooleanProp,

   /** Target url. */
   href?: Cx.StringProp,
   
   baseClass?: string,
   tag?: string,


}

export class Link extends Cx.Widget<LinkProp> {}
