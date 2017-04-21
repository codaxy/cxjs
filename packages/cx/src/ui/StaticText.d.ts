import * as Cx from '../core';

interface StaticTextProps extends Cx.WidgetProps {
    text: string
}

export class StaticText extends Cx.Widget<StaticTextProps> {}

