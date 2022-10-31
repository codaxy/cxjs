import * as Cx from "../core";

interface DataProxyProps extends Cx.PureContainerProps {
   data?: Cx.StructuredProp;
   value?: Cx.Binding;
   alias?: string;
   cached?: boolean;
   immutable?: boolean;
}

export class DataProxy extends Cx.Widget<DataProxyProps> {}
