import * as Cx from '../../packages/cx/src/core';

export interface ScrollIntoViewProps extends Cx.StyledContainerProps {
   selector?: Cx.StringProp
}

export class ScrollIntoView extends Cx.Widget<ScrollIntoViewProps> {}
