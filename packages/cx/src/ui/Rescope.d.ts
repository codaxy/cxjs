import * as Cx from "../core";

interface RescopeProps extends Cx.PureContainerProps {
   bind: string;
   rootName?: string;
   rootAlias?: string;
   data?: Cx.StructuredProp;
}

export class Rescope extends Cx.Widget<RescopeProps> {}
