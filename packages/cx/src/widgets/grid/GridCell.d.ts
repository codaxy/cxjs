import * as Cx from '../../core';

interface GridCellProps extends Cx.PureContainerProps {
   value?: Cx.StringProp | Cx.NumberProp,
   weight?: Cx.Prop<any>,
   pad?: Cx.BooleanProp,
   format?: Cx.StringProp
}

export class GridCell extends Cx.Widget<GridCellProps> {}
