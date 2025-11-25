import { Widget, VDOM } from "../ui/Widget";
import { ColumnBarBase, ColumnBarBaseConfig, ColumnBarBaseInstance } from "./ColumnBarBase";
import { Rect } from "../svg/util/Rect";
import { isDefined } from "../util/isDefined";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp } from "../ui/Prop";

export interface ColumnConfig extends ColumnBarBaseConfig {
   /** Column base value. Default value is `0`. */
   y0?: NumberProp;

   /** Size (width) of the column in axis units. */
   size?: NumberProp;

   /** Set to true to auto calculate size and offset. Available only if the x axis is a category axis. */
   autoSize?: BooleanProp;

   /** Alias for size. */
   width?: number;

   /** Minimum column size in pixels. Useful for indicating very small values. Default value is 0.5. */
   minPixelHeight?: number;

   /** Hide the base of the column (y0). */
   hiddenBase?: boolean;
}

export class Column extends ColumnBarBase {
   declare y0: number;
   declare size: number;
   declare autoSize: boolean;
   declare width: number;
   declare minPixelHeight: number;
   declare hiddenBase: boolean;

   constructor(config: ColumnConfig) {
      super(config);
   }

   init(): void {
      if (isDefined(this.width)) this.size = this.width;

      super.init();
   }

   declareData(...args: any[]): any {
      return super.declareData(
         {
            y0: undefined,
            size: undefined,
            autoSize: undefined,
         },
         ...args,
      );
   }

   checkValid(data: any): boolean {
      return data.x != null && data.y != null && data.y0 != null;
   }

   explore(context: RenderingContext, instance: ColumnBarBaseInstance): void {
      let { data, xAxis, yAxis } = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      if (!data.valid) return;

      if (data.active) {
         xAxis.acknowledge(data.x, data.size, data.offset);

         if (data.autoSize) xAxis.book(data.x, data.stacked ? data.stack : data.name);

         if (data.stacked) {
            yAxis.stacknowledge(data.stack, data.x, data.y0);
            yAxis.stacknowledge(data.stack, data.x, data.y);
         } else {
            if (!this.hiddenBase) yAxis.acknowledge(data.y0);
            yAxis.acknowledge(data.y);
         }
         super.explore(context, instance);
      }
   }

   calculateRect(instance: ColumnBarBaseInstance): Rect {
      var { data } = instance;
      var { offset, size } = data;

      if (data.autoSize) {
         var [index, count] = instance.xAxis.locate(data.x, data.stacked ? data.stack : data.name);
         offset = (size / count) * (index - count / 2 + 0.5);
         size = size / count;
      }

      var x1 = instance.xAxis.map(data.x, offset - size / 2);
      var x2 = instance.xAxis.map(data.x, offset + size / 2);
      var y1 = data.stacked ? instance.yAxis.stack(data.stack, data.x, data.y0) : instance.yAxis.map(data.y0);
      var y2 = data.stacked ? instance.yAxis.stack(data.stack, data.x, data.y) : instance.yAxis.map(data.y);

      if (Math.abs(y2 - y1) < this.minPixelHeight) {
         if (y1 < y2) y2 = y1 + this.minPixelHeight;
         else y2 = y1 - this.minPixelHeight;
      }

      var bounds = new Rect({
         l: Math.min(x1, x2),
         r: Math.max(x1, x2),
         t: Math.min(y1, y2),
         b: Math.max(y1, y2),
      });

      return bounds;
   }
}

Column.prototype.baseClass = "column";
Column.prototype.y0 = 0;
Column.prototype.size = 1;
Column.prototype.autoSize = false;
Column.prototype.legendShape = "column";
Column.prototype.hiddenBase = false;
Column.prototype.minPixelHeight = 0.5;

Widget.alias("column", Column);
