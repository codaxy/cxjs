import * as Cx from '../core';

interface RestateProps extends Cx.PureContainerProps {
   data: Cx.StructuredProp,
   detached?: boolean,
   deferredUntilIdle?: Cx.BooleanProp,
   idleTimeout?: Cx.NumberProp
}

export class Restate extends Cx.Widget<RestateProps> {}
export class PrivateState extends Cx.Widget<RestateProps> {}