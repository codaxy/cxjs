import * as Cx from '../../core';

interface LinkProps extends Cx.HtmlElementProps{

   /** Set to `true` to disable the link. */
   disabled?: Cx.BooleanProp,

   /** Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation. */
   href?: Cx.StringProp,

   /** Text associated with the link. */
   text?: Cx.StringProp,
   
   url?: Cx.StringProp,
   baseClass?: string,
   match?: "equal" | "prefix"

}

export class Link extends Cx.Widget<LinkProps> {}
