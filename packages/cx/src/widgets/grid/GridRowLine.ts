import { Container, ContainerConfig } from "../../ui/Container";
import { Widget } from "../../ui/Widget";
import { GridCell, GridCellConfig } from "./GridCell";
import { RenderingContext } from "../../ui/RenderingContext";
import { Instance } from "../../ui/Instance";
import { BooleanProp } from "../../ui/Prop";

export interface GridRowLineConfig extends ContainerConfig {
   /** Array of column configurations for this row line. */
   columns?: GridCellConfig[];

   /** Record alias used for data binding. */
   recordName?: string;

   /** Whether this row line is visible. */
   visible?: BooleanProp;
}

export class GridRowLine extends Container {
   declare columns?: GridCellConfig[];
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

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      return {
         key,
         data,
         content: this.renderChildren(context, instance),
         atomic: true
      };
   }
}

GridRowLine.prototype.styled = true;
