/** @jsxImportSource react */

import { VDOM, getContent, contentAppend } from "../Widget";
import { StyledContainerBase, StyledContainerConfig } from "../Container";
import { Instance } from "../Instance";
import { isArray } from "../../util/isArray";
import { isUndefined } from "../../util/isUndefined";
import { isNumber } from "../../util/isNumber";
import { RenderingContext } from "../RenderingContext";

function validContent(r: any): any {
   let content: any[] = [];
   for (let key in r) if (key != "label") contentAppend(content, r[key]);
   return content;
}

interface LayoutState {
   rows: any[];
   currentRow: number;
   labelCells: any[];
   fieldCells: any[];
   rowCapacities: number[];
}

export interface LabelsTopLayoutConfig extends StyledContainerConfig {
   vertical?: boolean;
   columns?: number;
}

export class LabelsTopLayout extends StyledContainerBase<LabelsTopLayoutConfig, Instance> {
   declare vertical?: boolean;
   declare columns?: number;

   constructor(config?: LabelsTopLayoutConfig) {
      super(config);
   }

   init(): void {
      if (this.vertical && isUndefined(this.columns)) this.columns = 1;

      super.init();
   }

   render(context: RenderingContext, instance: any, key: any): any {
      let { children, data } = instance;

      let state: LayoutState = {
         rows: [],
         currentRow: 0,
         labelCells: [],
         fieldCells: [],
         rowCapacities: [this.columns!],
      };

      const processContent = (r: any) => {
         if (!r) return;
         if (isArray(r.content) && r.useParentLayout) r.content.forEach((x: any) => processContent(x));
         else if (r.atomic && r.type == "layout-cell")
            this.addItem(state, isArray(r.content) && r.content.length == 1 ? r.content[0] : r.content, r.data);
         else this.addItem(state, r, {});
      };

      children.forEach((item: any) => processContent(item.vdom));

      this.addRow(state);

      return (
         <table key={key} className={data.classNames} style={data.style}>
            <tbody>{state.rows}</tbody>
         </table>
      );
   }

   addRow(state: LayoutState): void {
      if (state.labelCells.length > 0) state.rows.push(<tr key={state.rows.length}>{state.labelCells}</tr>);

      if (state.fieldCells.length > 0) state.rows.push(<tr key={state.rows.length}>{state.fieldCells}</tr>);

      state.labelCells = [];
      state.fieldCells = [];
      state.currentRow++;
      if (state.currentRow == state.rowCapacities.length) state.rowCapacities.push(this.columns!);
   }

   addItem(state: LayoutState, item: any, data: any): void {
      while (state.labelCells.length == state.rowCapacities[state.currentRow]) this.addRow(state);

      if (data.rowSpan > 1) {
         for (let row = state.currentRow + 1; row < state.currentRow + data.rowSpan; row++) {
            if (row == state.rowCapacities.length) state.rowCapacities.push(this.columns!);
            state.rowCapacities[row] -= data.colSpan || 1;
         }
      }

      if (data.colSpan > 1) state.rowCapacities[state.currentRow] -= data.colSpan - 1;

      state.labelCells.push(
         <td
            className={this.CSS!.element(this.baseClass!, "label")}
            key={state.labelCells.length}
            colSpan={data.colSpan}
         >
            {getContent(item.label)}
         </td>,
      );
      state.fieldCells.push(
         <td
            className={this.CSS!.element(this.baseClass!, "field")}
            key={state.fieldCells.length}
            colSpan={data.colSpan}
            rowSpan={isNumber(data.rowSpan) ? 2 * data.rowSpan - 1 : undefined}
            style={data.style}
         >
            {validContent(item)}
         </td>,
      );
   }
}

LabelsTopLayout.prototype.baseClass = "labelstoplayout";
LabelsTopLayout.prototype.vertical = false;
LabelsTopLayout.prototype.columns = undefined;

export interface LabelsTopLayoutCellConfig extends StyledContainerConfig {
   colSpan?: number;
   rowSpan?: number;
}

export class LabelsTopLayoutCell extends StyledContainerBase<LabelsTopLayoutCellConfig, Instance> {
   declare colSpan?: number;
   declare rowSpan?: number;

   constructor(config?: LabelsTopLayoutCellConfig) {
      super(config);
   }

   declareData(...args: any[]): void {
      super.declareData(...args, {
         colSpan: undefined,
         rowSpan: undefined,
      });
   }

   render(context: RenderingContext, instance: any, key: any): any {
      let { content } = (this as any).renderChildren(context, instance);

      return {
         atomic: true,
         type: "layout-cell",
         data: instance.data,
         content,
      };
   }
}

LabelsTopLayoutCell.prototype.useParentLayout = true;
