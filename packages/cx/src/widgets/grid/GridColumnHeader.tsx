/** @jsxImportSource react */
// Widgets of the column header rows: GridColumnHeaderLine is one header row, created by Grid for each row of
// columns; it creates a GridColumnHeader for each column, which creates a GridColumnHeaderCell for each header line.
import { Binding } from "../../data/Binding";
import { getSelector } from "../../data/getSelector";
import { isSelector } from "../../data/isSelector";
import { Instance } from "../../ui/Instance";
import { BooleanProp, ClassProp, NumberProp, StringProp, StyleProp } from "../../ui/Prop";
import { PureContainerBase, PureContainerConfig } from "../../ui/PureContainer";
import { RenderingContext } from "../../ui/RenderingContext";
import { Widget } from "../../ui/Widget";
import { isObject } from "../../util/isObject";
import type { GridColumnConfig, GridColumnHeaderConfig } from "./Grid.types";

export interface GridColumnHeaderLineConfig extends PureContainerConfig {
   columns?: GridColumnConfig[];
   showHeader?: BooleanProp;
   headerStyle?: StyleProp;
   headerClass?: ClassProp;
}

export class GridColumnHeaderLine extends PureContainerBase<GridColumnHeaderLineConfig> {
   declare columns?: GridColumnConfig[];
   declare showHeader: boolean;
   declare headerStyle?: any;
   declare headerClass?: any;
   declare className?: any;
   declare class?: any;
   declare isPureContainer: boolean;
   declare styled: boolean;

   declareData() {
      return super.declareData(...arguments, {
         showHeader: undefined,
      });
   }

   init() {
      this.items = Widget.create(GridColumnHeader, this.columns || []) as any;
      this.visible = this.showHeader;
      this.style = this.headerStyle;
      this.className = this.headerClass;
      this.class = null;
      super.init();
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      return (
         <tr key={key} className={data.classNames} style={data.style}>
            {this.renderChildren(context, instance)}
         </tr>
      );
   }
}

GridColumnHeaderLine.prototype.isPureContainer = false;
GridColumnHeaderLine.prototype.styled = true;
GridColumnHeaderLine.prototype.showHeader = true;
GridColumnHeaderLine.autoInit = true;

export class GridColumnHeader extends Widget<GridColumnHeaderConfig> {
   declare format?: any;
   declare width?: any;
   declare defaultWidth?: any;
   declare fixed?: any;
   declare field?: string;
   declare sortable?: boolean;
   declare resizable?: boolean;
   declare draggable?: boolean;
   declare header?: any;
   declare header1?: any;
   declare header2?: any;
   declare header3?: any;
   declare footer?: any;
   declare caption?: any;
   declare aggregateField?: string;
   declare aggregateAlias?: string;
   declare aggregateAliasGetter?: any;
   declare pad?: boolean;
   declare colSpan?: any;
   declare style?: any;
   declare className?: any;
   declare class?: any;
   declareData() {
      return super.declareData(...arguments, {
         format: undefined,
         width: undefined,
         defaultWidth: undefined,
         fixed: undefined,
      });
   }

   init() {
      delete this.style;
      delete this.className;
      delete this.class;

      if (this.header) this.header1 = this.header;

      if (this.header1 || this.resizable || this.width || this.defaultWidth || this.sortable || this.draggable) {
         if (!isObject(this.header1))
            this.header1 = {
               text: this.header1 || "",
            };

         if (this.resizable) this.header1.resizable = this.resizable;

         if (this.width) this.header1.width = this.width;

         if (this.defaultWidth) this.header1.defaultWidth = this.defaultWidth;

         if (this.draggable) this.header1.draggable = this.draggable;
      }

      if (this.header2 && isSelector(this.header2))
         this.header2 = {
            text: this.header2,
         };

      if (this.header3 && isSelector(this.header3))
         this.header3 = {
            text: this.header3,
         };

      if (!this.aggregateField && this.field) this.aggregateField = this.field;

      if (!this.aggregateAlias) this.aggregateAlias = this.aggregateField;
      if (this.aggregateAlias) this.aggregateAliasGetter = Binding.get(this.aggregateAlias).value;

      if (this.footer && isSelector(this.footer))
         this.footer = {
            value: this.footer,
            pad: this.pad,
            colSpan: this.colSpan,
         };

      if (this.footer) {
         this.footer.value = getSelector(this.footer.value);
         this.footer.class = getSelector(this.footer.class);
         this.footer.style = getSelector(this.footer.style);
         this.footer.format = getSelector(this.footer.format);
      }

      if (this.caption && isSelector(this.caption))
         this.caption = {
            value: this.caption,
            pad: this.pad,
            format: this.format,
         };

      if (this.caption) {
         let children = this.caption.children || this.caption.items;
         if (children) {
            delete this.caption.items;
            this.caption.children = Widget.create(children);
         } else {
            this.caption.value = getSelector(this.caption.value);
            this.caption.format = getSelector(this.caption.format);
         }
         this.caption.class = getSelector(this.caption.class);
         this.caption.style = getSelector(this.caption.style);
      }

      super.init();
   }

   initComponents() {
      return super.initComponents({
         header1: this.header1 && GridColumnHeaderCell.create(this.header1),
         header2: this.header2 && GridColumnHeaderCell.create(this.header2),
         header3: this.header3 && GridColumnHeaderCell.create(this.header3),
      });
   }

   render() {
      return null;
   }
}

GridColumnHeader.autoInit = true;

export interface GridColumnHeaderCellConfig extends PureContainerConfig {
   text?: StringProp;
   colSpan?: NumberProp;
   rowSpan?: NumberProp;
   width?: NumberProp;
   defaultWidth?: NumberProp;
   resizable?: BooleanProp;
   fixed?: BooleanProp;
   draggable?: BooleanProp;
   tool?: any;
   allowSorting?: boolean;
}

export class GridColumnHeaderCell extends PureContainerBase<GridColumnHeaderCellConfig> {
   declare text?: any;
   declare colSpan?: any;
   declare rowSpan?: any;
   declare width?: any;
   declare defaultWidth?: any;
   declare resizable?: any;
   declare fixed?: any;
   declare draggable?: any;
   declare tool?: any;
   declare allowSorting?: boolean;

   declareData() {
      return super.declareData(...arguments, {
         text: undefined,
         colSpan: undefined,
         rowSpan: undefined,
         width: undefined,
         defaultWidth: undefined,
         resizable: undefined,
         fixed: undefined,
         draggable: undefined,
      });
   }

   initComponents() {
      return super.initComponents(...arguments, {
         tool: this.tool && Widget.create(this.tool),
      });
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      let { data } = instance;
      return data.text || super.render(context, instance, key);
   }
}

GridColumnHeaderCell.prototype.colSpan = 1;
GridColumnHeaderCell.prototype.rowSpan = 1;
GridColumnHeaderCell.prototype.allowSorting = true;
GridColumnHeaderCell.prototype.styled = true;
GridColumnHeaderCell.prototype.fixed = false;
