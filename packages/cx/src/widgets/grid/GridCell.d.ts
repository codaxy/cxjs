import * as Cx from "../../core";

interface GridCellProps extends Cx.PureContainerProps {
   /** Selector used to obtain the value that should be displayed inside the cell. Not required if `field` is used. */
   value?: Cx.StringProp | Cx.NumberProp;

   /** Selector used to obtain the weight of the cell in aggregate operations, such as weighted averages. */
   weight?: Cx.Prop<any>;

   /** Add default padding to grid cell. */
   pad?: Cx.BooleanProp;

   /** Format specifier used to convert the value into a string. */
   format?: Cx.StringProp;

   /** Name of the field that holds the value to be displayed. */
   field?: boolean;

   /** Record alias. Default is `$record`. */
   recordName?: string;

   /** Record alias. Default is `$record`. */
   recordAlias?: string;

   /** Indicate if a cell is editable or not. Default value is true. */
   editable?: boolean;

   /**
    * Used to indicate that the adjacent cells in the column should be merged together.
    * If set to `same-value`, only cells with the same value will be merged.
    * If set to `always`, all cells within the group will be merged.
    * This is an experimental feature that might not work well with other
    * grid related features such as multi-line rows, buffered rendering, etc.
    */
   mergeCells?: Cx.Prop<"same-value" | "always">;
}

export class GridCell extends Cx.Widget<GridCellProps> {}
