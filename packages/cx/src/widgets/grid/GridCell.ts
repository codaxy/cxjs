import { StyledContainerBase, StyledContainerConfig } from "../../ui";
import { Format } from "../../ui/Format";
import { Instance } from "../../ui/Instance";
import { BooleanProp, NumberProp, Prop, StringProp } from "../../ui/Prop";
import { RenderingContext } from "../../ui/RenderingContext";
import { isUndefined } from "../../util/isUndefined";

export interface GridCellConfig extends StyledContainerConfig {
   /** Selector used to obtain the value that should be displayed inside the cell. Not required if `field` is used. */
   value?: StringProp | NumberProp;

   /** Selector used to obtain the weight of the cell in aggregate operations, such as weighted averages. */
   weight?: Prop<any>;

   /** Add default padding to grid cell. */
   pad?: BooleanProp;

   /** Format specifier used to convert the value into a string. */
   format?: StringProp;

   /** Name of the field that holds the value to be displayed. */
   field?: string;

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
   mergeCells?: Prop<"same-value" | "always">;

   /** Aggregate value for the cell. */
   aggregateValue?: Prop<any>;

   /** Column span. */
   colSpan?: NumberProp;

   /** Row span. */
   rowSpan?: NumberProp;

   /** Whether the column is fixed. */
   fixed?: BooleanProp;

   /** Cell alignment. */
   align?: "left" | "right" | "center";

   /** Editor widget for cell editing. */
   editor?: any;

   /** Unique column identifier. */
   uniqueColumnId?: string;
}

export class GridCell extends StyledContainerBase<GridCellConfig> {
   declare value?: StringProp | NumberProp;
   declare field?: string;
   declare recordName?: string;
   declare editable?: boolean;
   declare align?: "left" | "right" | "center";
   declare editor?: any;
   declare uniqueColumnId?: string;
   declare pad?: boolean;
   declare fixed?: boolean;
   declare merged?: boolean;

   constructor(config?: GridCellConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      return super.declareData(...args, {
         value: undefined,
         aggregateValue: undefined,
         weight: undefined,
         pad: undefined,
         format: undefined,
         colSpan: undefined,
         rowSpan: undefined,
         editable: undefined,
         fixed: undefined,
         mergeCells: undefined,
      });
   }

   init() {
      if (!this.value && this.field) this.value = { bind: this.recordName + "." + this.field };

      if (isUndefined(this.editable)) this.editable = !!this.editor;

      super.init();
   }

   prepareCSS(context: RenderingContext, instance: Instance) {
      let { data } = instance;

      data.classNames = this.CSS.expand(
         data.className,
         data.class,
         this.CSS.state({
            pad: data.pad,
            editable: data.editable,
            ["aligned-" + this.align]: this.align,
            mergable: data.merged,
         }),
      );

      data.style = this.CSS.parseStyle(data.style);
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      let content;

      if (this.items.length > 0) content = this.renderChildren(context, instance);
      else {
         content = data.value;
         if (data.format) content = Format.value(content, data.format);
      }

      return {
         atomic: true,
         content,
         instance,
         data,
         key,
         uniqueColumnId: this.uniqueColumnId,
      };
   }
}

GridCell.prototype.pad = true;
GridCell.prototype.fixed = false;
GridCell.prototype.merged = false;
