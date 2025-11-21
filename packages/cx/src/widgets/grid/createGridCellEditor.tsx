import { ValidationGroup } from "../form/ValidationGroup";
import { GridCellEditor } from "./GridCellEditor";
import { BooleanProp } from "../../ui/Prop";

export function createGridCellEditor(
   className: string,
   style: any,
   valid: BooleanProp,
   columnEditor: any
) {
   return (
      <GridCellEditor className={className} style={style}>
         <ValidationGroup valid={valid}>
            {columnEditor}
         </ValidationGroup>
      </GridCellEditor>
   );
}
