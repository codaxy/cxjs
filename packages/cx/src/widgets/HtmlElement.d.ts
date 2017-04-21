import * as Cx from '../core';

interface HtmlElementProps extends Cx.HtmlElementProps {

   /** HTML to be injected into the element. */
   innerHtml?: Cx.StringProp,

   attrs?: Cx.StructuredProp,
   data?: Cx.StructuredProp,

   /** Name of the HTML element to be rendered. Default is `div`. */
   tag?: string,

   /** HTML to be injected into the element. */
   html?: string,

   styled?: boolean
 
}

export class HtmlElement extends Cx.Widget<HtmlElementProps> {}
