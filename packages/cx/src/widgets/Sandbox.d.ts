import * as Cx from '../core';

interface SandboxProps extends Cx.PureContainerProps {

    storage: Cx.StringProp,

    key?: Cx.StringProp,

    accessKey?: Cx.StringProp,
    
    recordName?: string,
    recordAlias?: string,
    immutable?: boolean
    
}

export class Sandbox extends Cx.Widget<SandboxProps> {}
