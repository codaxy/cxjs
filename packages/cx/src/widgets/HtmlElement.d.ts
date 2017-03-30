import * as Cx from '../core';

interface HtmlElementProps extends Cx.PureContainerProps{
    text?: Cx.StringProp,
    innerHtml?: Cx.StringProp,
    attrs?: Cx.StructuredProp,
    data?: Cx.StructuredProp,
    tag?: string
}

export class HtmlElement extends Cx.Widget<Cx.HtmlElementProps> {}
