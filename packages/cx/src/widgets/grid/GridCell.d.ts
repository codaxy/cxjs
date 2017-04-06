import * as Cx from '../../core';

interface GridCellProps extends Cx.PureContainerProps {

   value?: Cx.StringProp | Cx.NumberProp,
   weight?: Cx.Prop<any>,
   pad?: Cx.BooleanProp,
   format?: Cx.StringProp
   field?: boolean,
   recordName?: string,
   styled?: boolean

}

export class GridCell extends Cx.Widget<GridCellProps> {}
