import * as Cx from '../core';

interface HtmlElementProps extends Cx.PureContainerProps{
    text?: Cx.StringProp,
    innerHtml?: Cx.StringProp,
    attrs?: ,
    data?: ,
    tag?: string,
    div?: 
}

export class HtmlElement extends Cx.Widget<Cx.HtmlElementProps> {}
