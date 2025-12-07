/** @jsxImportSource react */

import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import { Selection } from "../ui/selection/Selection";
import { CSS } from "../ui/CSS";
import { isArray } from "../util/isArray";
import { Instance } from "../ui/Instance";
import { RenderingContext, CxChild } from "../ui/RenderingContext";
import { Prop, StyleProp, DataRecord } from "../ui/Prop";
import { Create } from "../util/Component";
import type { ChartRenderingContext } from "./Chart";

export interface BubbleGraphConfig extends WidgetConfig {
   /** Data array for the bubbles. */
   data?: Prop<DataRecord[]>;

   /** Default bubble radius. Default is 10. */
   bubbleRadius?: number;

   /** Style object applied to all bubbles. */
   bubbleStyle?: StyleProp;

   /** Name of the x-axis. Default is 'x'. */
   xAxis?: string;

   /** Name of the y-axis. Default is 'y'. */
   yAxis?: string;

   /** Name of the field in data objects that contains x values. Default is 'x'. */
   xField?: string;

   /** Name of the field in data objects that contains y values. Default is 'y'. */
   yField?: string;

   /** Name of the field in data objects that contains radius values. Default is 'r'. */
   rField?: string;

   /** Selection configuration. */
   selection?: Create<typeof Selection>;
}

export interface BubbleGraphInstance extends Instance {
   axes: { [key: string]: any };
}

export class BubbleGraph extends Widget<BubbleGraphConfig> {
   declare baseClass: string;
   declare xAxis: string;
   declare yAxis: string;
   declare xField: string;
   declare yField: string;
   declare rField: string;
   declare bubbleRadius: number;
   declare selection: Selection;
   declare data?: Prop<DataRecord[]>;

   constructor(config?: BubbleGraphConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      var selection = this.selection.configureWidget(this);

      super.declareData(
         ...args,
         {
            data: undefined,
            bubbleRadius: undefined,
            bubbleStyle: {
               structured: true,
            },
         },
         selection,
      );
   }

   init() {
      this.selection = Selection.create(this.selection as Create<typeof Selection>, {
         records: this.data,
      });
      super.init();
   }

   explore(context: ChartRenderingContext, instance: BubbleGraphInstance) {
      instance.axes = context.axes!;
      super.explore(context, instance);
      var { data } = instance;
      const d = data as any;
      if (isArray(d.data)) {
         d.data.forEach((p: DataRecord) => {
            instance.axes[this.xAxis].acknowledge(p[this.xField]);
            instance.axes[this.yAxis].acknowledge(p[this.yField]);
         });
      }
   }

   prepare(context: ChartRenderingContext, instance: BubbleGraphInstance) {
      super.prepare?.(context, instance);
      if (instance.axes[this.xAxis].shouldUpdate || (instance.axes as any)[this.yAxis].shouldUpdate)
         instance.markShouldUpdate(context);
   }

   render(context: ChartRenderingContext, instance: BubbleGraphInstance, key: string): CxChild {
      var { data } = instance;
      return (
         <g key={key} className={(data as any).classNames}>
            {this.renderData(context, instance)}
         </g>
      );
   }

   renderData(context: ChartRenderingContext, instance: BubbleGraphInstance): any {
      var { data, axes, store } = instance;
      const d = data as any;

      var xAxis = (axes as any)[this.xAxis];
      var yAxis = (axes as any)[this.yAxis];

      return (
         isArray(d.data) &&
         d.data.map((p: DataRecord, i: number) => {
            var selected = this.selection && this.selection.isSelected(store, p, i);
            var classes = CSS.element(this.baseClass, "bubble", {
               selected: selected,
            });
            return (
               <circle
                  key={i}
                  className={classes}
                  cx={xAxis.map(p[this.xField])}
                  cy={yAxis.map(p[this.yField])}
                  r={(p as any)[this.rField] || d.bubbleRadius}
                  style={(p as any).style || d.bubbleStyle}
                  onClick={(e) => {
                     this.onBubbleClick(e, instance, i);
                  }}
               />
            );
         })
      );
   }

   onBubbleClick(e: React.MouseEvent, instance: BubbleGraphInstance, index: number) {
      const { data, store } = instance;
      const d = data as any;
      var bubble = d.data[index];
      this.selection.select(store, bubble, index, {
         toggle: e.ctrlKey,
      });
   }
}

BubbleGraph.prototype.baseClass = "bubblegraph";
BubbleGraph.prototype.xAxis = "x";
BubbleGraph.prototype.yAxis = "y";

BubbleGraph.prototype.xField = "x";
BubbleGraph.prototype.yField = "y";
BubbleGraph.prototype.rField = "r";

BubbleGraph.prototype.bubbleRadius = 10;

Widget.alias("bubble-graph", BubbleGraph);
