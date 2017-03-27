import * as Cx from '../core';

interface SectionProps extends Cx.StyledContainerProps {
    id?: string | number | Cx.Binding | Cx.Selector<string | number>,
    pad?: boolean | Cx.Binding | Cx.Selector<boolean>
}

export class Section extends Cx.Widget<SectionProps> {}
