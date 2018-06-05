import * as Cx from '../core';

interface RestateProps extends Cx.PureContainerProps {
    data: Cx.StructuredProp
}

export class Restate extends Cx.Widget<RestateProps> {}
