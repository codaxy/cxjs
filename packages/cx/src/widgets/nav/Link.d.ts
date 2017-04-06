import * as Cx from '../../core';

interface LinkProps extends Cx.HtmlElementProps {

   /** Set to `true` to disable the link. */
   disabled?: Cx.BooleanProp,

   /** Url to the link's target location. Should start with `~/` or `#/` for pushState/hash based navigation. */
   href?: Cx.StringProp,
   
   url?: Cx.StringProp,

   /** Base CSS class to be applied to the element. No class is applied by default. */
   baseClass?: string,
   
   tag?: string,
   match?: "equal" | "prefix"

}

export class Link extends Cx.Widget<LinkProps> {}
