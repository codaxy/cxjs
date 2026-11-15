import { Container, ContainerConfig } from "../../ui/Container";
import { Widget } from "../../ui/Widget";
import { GridCell, GridCellRenderResult } from "./GridCell";
import type { GridColumnConfig } from "./Grid";
import { RenderingContext } from "../../ui/RenderingContext";
import { Instance } from "../../ui/Instance";
import { BooleanProp } from "../../ui/Prop";

/** What a line of a grid row renders: its cells and the data for its `<tr>` element. */
export interface GridRowLineRenderResult {
   atomic: true;
   key: string;
   data: { classNames?: string; style?: any; [key: string]: any };
   content: GridCellRenderResult[];
}

export interface GridRowLineConfig extends ContainerConfig {
   /** Array of column configurations for this row line. */
   columns?: GridColumnConfig[];

   /** Record alias used for data binding. */
   recordName?: string;

   /** Whether this row line is visible. */
   visible?: BooleanProp;

   /** Whether to show the header row for this line. */
   showHeader?: BooleanProp;
}

export class GridRowLine extends Container {
   declare columns?: GridColumnConfig[];
   declare recordName?: string;

   constructor(config?: GridRowLineConfig) {
      super(config);
   }

   init() {
      this.items = Widget.create(GridCell, this.columns || [], {
         recordName: this.recordName
      }) as unknown as Widget[];
      super.init();
   }

   render(context: RenderingContext, instance: Instance, key: string): GridRowLineRenderResult {
      let { data } = instance;
      return {
         key,
         data,
         // the children of a line are grid cells
         content: this.renderChildren(context, instance) as GridCellRenderResult[],
         atomic: true
      };
   }
}

GridRowLine.prototype.styled = true;
