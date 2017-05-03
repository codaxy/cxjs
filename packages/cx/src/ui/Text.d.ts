import * as Cx from '../core'

interface TextProps extends Cx.WidgetProps {
   value?: Cx.StringProp,
   bind?: string,
   tpl?: string,
   expr?: string,
}

export class Text extends Cx.Widget<TextProps> { }
