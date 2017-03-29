import * as Cx from '../core';

interface SandboxProps extends Cx.PureContainerProps {
    storage: Cx.BooleanProp,
    key: Cx.BooleanProp,
    recordName?: boolean
}

export class Sandbox extends Cx.Widget<SandboxProps> {}
