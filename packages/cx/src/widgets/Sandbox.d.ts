import * as Cx from '../core';

interface SandboxProps extends Cx.PureContainerProps {
    storage: Cx.StringProp,

    /* Cx.StringProp doesn't work for unknown reason */
    key: any,
    
    recordName?: string
    recordAlias?: string
}

export class Sandbox extends Cx.Widget<SandboxProps> {}
