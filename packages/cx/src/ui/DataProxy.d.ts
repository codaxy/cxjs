import * as Cx from '../core';

interface DataProxyProps extends Cx.PureContainerProps {
   data?: Cx.StructuredProp,
   value?: Cx.Binding,
   alias?: string
}

export class DataProxy extends Cx.Widget<DataProxyProps> {}
