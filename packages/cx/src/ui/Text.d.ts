import * as Cx from '../core';

interface TextProps extends Cx.WidgetProps, Cx.Binding {
    value?: Cx.StringProp
}

export class Text extends Cx.Widget<TextProps> {}
