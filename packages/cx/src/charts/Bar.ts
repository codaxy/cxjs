import { Widget, VDOM } from "../ui/Widget";
import { ColumnBarBase, ColumnBarBaseConfig, ColumnBarBaseInstance } from "./ColumnBarBase";
import { Rect } from "../svg/util/Rect";
import { isDefined } from "../util/isDefined";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp } from "../ui/Prop";

export interface BarConfig extends ColumnBarBaseConfig {
   /** Base value. Default value is `0`. */
   x0?: NumberProp;

   /** Size (height) of the bar in axis units. */
   size?: NumberProp;

   /** Set to true to auto calculate size and offset. Available only if the y axis is a category axis. */
   autoSize?: BooleanProp;

   /** Alias for size. */
   height?: number;

   /** Hide the base of the bar (x0). */
   hiddenBase?: boolean;
}

export class Bar extends ColumnBarBase {
   declare x0: number;
   declare size: number;
   declare autoSize: boolean;
   declare height: number;
   declare hiddenBase: boolean;

   constructor(config: BarConfig) {
      super(config);
   }

   init(): void {
      if (isDefined(this.height)) this.size = this.height;

      super.init();
   }

   declareData(...args: any[]): any {
      return super.declareData(
         {
            x0: undefined,
            size: undefined,
            autoSize: undefined,
         },
         ...args,
      );
   }

   checkValid(data: any): boolean {
      return data.y != null && data.x != null && data.x0 != null;
   }

   explore(context: RenderingContext, instance: ColumnBarBaseInstance): void {
      let { data, xAxis, yAxis } = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      if (!data.valid) return;

      if (data.active) {
         yAxis.acknowledge(data.y, data.size, data.offset);

         if (data.autoSize) yAxis.book(data.y, data.stacked ? data.stack : data.name);

         if (data.stacked) {
            xAxis.stacknowledge(data.stack, data.y, data.x0);
            xAxis.stacknowledge(data.stack, data.y, data.x);
         } else {
            if (!this.hiddenBase) xAxis.acknowledge(data.x0);
            xAxis.acknowledge(data.x);
         }
         super.explore(context, instance);
      }
   }

   calculateRect(instance: ColumnBarBaseInstance): Rect {
      let { data } = instance;
      var { offset, size } = data;

      if (data.autoSize) {
         var [index, count] = instance.yAxis.locate(data.y, data.stacked ? data.stack : data.name);
         offset = (size / count) * (index - count / 2 + 0.5);
         size = size / count;
      }

      var x1 = data.stacked ? instance.xAxis.stack(data.stack, data.y, data.x0) : instance.xAxis.map(data.x0);
      var x2 = data.stacked ? instance.xAxis.stack(data.stack, data.y, data.x) : instance.xAxis.map(data.x);
      var y1 = instance.yAxis.map(data.y, offset - size / 2);
      var y2 = instance.yAxis.map(data.y, offset + size / 2);

      var bounds = new Rect({
         l: Math.min(x1, x2),
         r: Math.max(x1, x2),
         t: Math.min(y1, y2),
         b: Math.max(y1, y2),
      });

      return bounds;
   }
}

Bar.prototype.baseClass = "bar";
Bar.prototype.x0 = 0;
Bar.prototype.size = 1;
Bar.prototype.autoSize = false;
Bar.prototype.legendShape = "bar";
Bar.prototype.hiddenBase = false;

Widget.alias("bar", Bar);
