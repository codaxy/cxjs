import * as Cx from '../../packages/cx/src/core';

export interface ScrollResetProps extends Cx.HtmlElementProps {
   trigger?: Cx.StructuredProp
}

export class ScrollReset extends Cx.Widget<ScrollResetProps> {}
