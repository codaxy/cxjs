import * as Cx from '../core';

interface IconProps extends Cx.WidgetProps{
    name?: Cx.StringProp,
    className?: Cx.Prop<string | {}>,
    class?: Cx.Prop<string | {}>,
    style?: Cx.Prop<string | {}>,
    baseClass?: string
}

export class Icon extends Cx.Widget<IconProps> {}
