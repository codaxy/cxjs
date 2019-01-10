import * as Cx from '../core';

interface SandboxProps extends Cx.PureContainerProps {

    storage: Cx.StringProp,

    /* Cx.StringProp doesn't work for unknown reason */
    key?: any,

    accessKey?: Cx.StringProp,
    
    recordName?: string,
    recordAlias?: string,
    immutable?: boolean
    
}

export class Sandbox extends Cx.Widget<SandboxProps> {}
