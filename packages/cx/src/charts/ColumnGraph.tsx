/** @jsxImportSource react */

import { Widget, VDOM } from "../ui/Widget";
import { ColumnBarGraphBase, ColumnBarGraphBaseConfig, ColumnBarGraphBaseInstance } from "./ColumnBarGraphBase";
import { tooltipMouseMove, tooltipMouseLeave, TooltipParentInstance } from "../widgets/overlay/tooltip-ops";
import { isArray } from "../util/isArray";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp } from "../ui/Prop";

export interface ColumnGraphConfig extends ColumnBarGraphBaseConfig {
   /**
    * Name of the property which holds the base value.
    * Default value is `false`, which means y0 value is not read from the data array.
    */
   y0Field?: string | false;

   /** Column base value. Default value is `0`. */
   y0?: NumberProp;

   /** Hide the base of the column (y0). */
   hiddenBase?: boolean;

   /** Tooltip configuration. */
   tooltip?: any;
}

export interface ColumnGraphInstance extends ColumnBarGraphBaseInstance, TooltipParentInstance {}

export class ColumnGraph extends ColumnBarGraphBase {
   declare y0Field: string | false;
   declare y0: number;
   declare hiddenBase: boolean;
   declare tooltip: any;

   constructor(config: ColumnGraphConfig) {
      super(config);
   }

   explore(context: RenderingContext, instance: ColumnGraphInstance): void {
      super.explore(context, instance);

      let { data, xAxis, yAxis } = instance;

      if (isArray(data.data)) {
         data.data.forEach((p: any, index: number) => {
            var y0 = this.y0Field ? p[this.y0Field] : data.y0;
            var x = p[this.xField];
            var y = p[this.yField];

            xAxis.acknowledge(x, data.size, data.offset);

            if (data.autoSize) xAxis.book(x, data.stacked ? data.stack : data.name);

            if (data.stacked) {
               yAxis.stacknowledge(data.stack, x, y0);
               yAxis.stacknowledge(data.stack, x, y);
            } else {
               if (!this.hiddenBase) yAxis.acknowledge(y0);
               yAxis.acknowledge(y);
            }
         });
      }
   }

   prepare(context: RenderingContext, instance: ColumnGraphInstance): void {
      super.prepare(context, instance);
      let { data } = instance;
      if (context.pointReducer && isArray(data.data)) {
         data.data.forEach((p: any, index: number) => {
            context.pointReducer(p[this.xField], p[this.yField], data.name, p, data.data, index);
         });
      }
   }

   renderGraph(context: RenderingContext, instance: ColumnGraphInstance): React.ReactNode {
      var { data, xAxis, yAxis, store } = instance;
      if (!isArray(data.data)) return false;

      var isSelected = this.selection.getIsSelectedDelegate(store);

      return data.data.map((p: any, i: number) => {
         var { offset, size } = data;

         var y0 = this.y0Field ? p[this.y0Field] : data.y0;
         var x = p[this.xField];
         var y = p[this.yField];

         if (data.autoSize) {
            var [index, count] = instance.xAxis.locate(x, data.stacked ? data.stack : data.name);
            offset = (size / count) * (index - count / 2 + 0.5);
            size = size / count;
         }

         var x1 = xAxis.map(x, offset - size / 2);
         var x2 = xAxis.map(x, offset + size / 2);
         var y1 = data.stacked ? yAxis.stack(data.stack, x, y0) : yAxis.map(y0);
         var y2 = data.stacked ? yAxis.stack(data.stack, x, y) : yAxis.map(y);

         var color = this.colorIndexField ? p[this.colorIndexField as string] : data.colorIndex;
         var state: Record<string, any> = {
            selected: isSelected(p, i),
            selectable: !this.selection.isDummy,
            [`color-${color}`]: color != null,
         };

         let mmove: ((e: React.MouseEvent) => void) | undefined,
            mleave: ((e: React.MouseEvent) => void) | undefined;

         if (this.tooltip) {
            mmove = (e) =>
               tooltipMouseMove(e, instance, this.tooltip, {
                  target: (e.target as any).parent,
                  data: {
                     $record: p,
                  },
               });
            mleave = (e) =>
               tooltipMouseLeave(e, instance, this.tooltip, {
                  target: (e.target as any).parent,
                  data: {
                     $record: p,
                  },
               });
         }

         return (
            <rect
               key={i}
               className={this.CSS.element(this.baseClass, "column", state)}
               onClick={(e) => {
                  this.handleClick(e, instance, p, i);
               }}
               x={Math.min(x1, x2)}
               y={Math.min(y1, y2)}
               width={Math.abs(x2 - x1)}
               height={Math.abs(y2 - y1)}
               style={data.style}
               onMouseMove={mmove}
               onMouseLeave={mleave}
               rx={data.borderRadius}
            />
         );
      });
   }
}

ColumnGraph.prototype.baseClass = "columngraph";
ColumnGraph.prototype.y0Field = false;
ColumnGraph.prototype.y0 = 0;
ColumnGraph.prototype.legendShape = "column";
ColumnGraph.prototype.hiddenBase = false;

Widget.alias("columngraph", ColumnGraph);
