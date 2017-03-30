import * as Cx from '../core';

interface SandboxProps extends Cx.PureContainerProps {
    storage: Cx.StringProp,
    key: Cx.StringProp,
    recordName?: string
    recordAlias?: string
}

export class Sandbox extends Cx.Widget<SandboxProps> {}
