import * as Cx from '../../core';

interface LabelsTopLayoutProps extends Cx.StyledContainerProps {
   vertical?: boolean,
   columns?: number
}

export class LabelsTopLayout extends Cx.Widget<LabelsTopLayoutProps> {}

interface LabelsTopLayoutCellProps extends Cx.StyledContainerProps {
   colSpan?: boolean,
   rowSpan?: number
}

export class LabelsTopLayoutCell extends Cx.Widget<LabelsTopLayoutCellProps> {}
