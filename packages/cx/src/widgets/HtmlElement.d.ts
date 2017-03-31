import * as Cx from '../core';

interface HtmlElementProps extends Cx.HtmlElementProps {
    innerHtml?: Cx.StringProp,
    attrs?: Cx.StructuredProp,
    data?: Cx.StructuredProp,
    tag?: string
}

export class HtmlElement extends Cx.Widget<HtmlElementProps> {}
