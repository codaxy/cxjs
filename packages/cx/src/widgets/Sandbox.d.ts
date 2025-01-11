import * as Cx from "../core";

interface SandboxProps extends Cx.PureContainerProps {
   storage: Cx.Prop<Cx.Record>;

   /* Cx.StringProp doesn't work for unknown reason */
   key?: any;

   accessKey?: Cx.StringProp;

   recordName?: Cx.RecordAlias;
   recordAlias?: Cx.RecordAlias;
   immutable?: Cx.BooleanProp;
}

export class Sandbox extends Cx.Widget<SandboxProps> {}
