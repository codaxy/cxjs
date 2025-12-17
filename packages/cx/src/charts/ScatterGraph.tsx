/** @jsxImportSource react */

import { CSS } from "../ui/CSS";
import { Instance } from "../ui/Instance";
import { BooleanProp, NumberProp, RecordsProp, StringProp } from "../ui/Prop";
import { RenderingContext } from "../ui/RenderingContext";
import { Widget, WidgetConfig, WidgetStyleConfig } from "../ui/Widget";
import { Selection } from "../ui/selection/Selection";
import { isArray } from "../util/isArray";
import type { ChartRenderingContext } from "./Chart";
import { getShape } from "./shapes";

export interface ScatterGraphConfig extends WidgetConfig, WidgetStyleConfig {
   /** Data for the graph. Each entry should be an object with at least two properties
    * whose names should match the `xField` and `yField` values.
    */
   data?: RecordsProp;

   /** Size of the scatter points. */
   size?: NumberProp;

   /** Shape of the scatter points. Default is `circle`. */
   shape?: StringProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: NumberProp;

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: StringProp;

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: StringProp;

   /** Name of the item as it will appear in the legend. */
   name?: StringProp;

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: BooleanProp;

   /** Name of the horizontal axis. Default value is `x`. */
   xAxis?: string;

   /** Name of the vertical axis. Default value is `y`. */
   yAxis?: string;

   /** Name of the property which holds the x value. Default value is `x`. */
   xField?: string;

   /** Name of the property which holds the y value. Default value is `y`. */
   yField?: string;

   /** Name of the property which holds the size value. */
   sizeField?: string | false;

   /** Name of the legend to be used. Default is `legend`. Set to `false` to hide the legend entry. */
   legend?: string | false;

   /** Action to perform on legend item click. Default is `auto`. */
   legendAction?: string;

   /** Selection configuration. */
   selection?: any;
}

export interface ScatterGraphInstance extends Instance {
   xAxis: any;
   yAxis: any;
   colorMap: any;
}

export class ScatterGraph extends Widget {
   declare baseClass: string;
   declare xAxis: string;
   declare yAxis: string;
   declare xField: string;
   declare yField: string;
   declare sizeField: string | false;
   declare size: number;
   declare shape: string;
   declare legend: string | false;
   declare legendAction: string;
   declare selection: Selection;
   declare data: any;

   constructor(config: ScatterGraphConfig) {
      super(config);
   }

   init(): void {
      this.selection = Selection.create(this.selection, {
         records: this.data,
      });
      super.init();
   }

   declareData(...args: any[]): void {
      var selection = this.selection.configureWidget(this);

      super.declareData(
         ...args,
         {
            data: undefined,
            size: undefined,
            shape: undefined,
            colorIndex: undefined,
            colorMap: undefined,
            colorName: undefined,
            name: undefined,
            active: true,
         },
         selection,
      );
   }

   prepareData(context: RenderingContext, instance: ScatterGraphInstance): void {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context: ChartRenderingContext, instance: ScatterGraphInstance): void {
      super.explore(context, instance);

      var xAxis = (instance.xAxis = context.axes![this.xAxis]);
      var yAxis = (instance.yAxis = context.axes![this.yAxis]);

      var { data } = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      if (data.active && isArray(data.data)) {
         data.data.forEach((p: any) => {
            xAxis.acknowledge(p[this.xField]);
            yAxis.acknowledge(p[this.yField]);
         });
      }
   }

   prepare(context: ChartRenderingContext, instance: ScatterGraphInstance): void {
      var { data, xAxis, yAxis, colorMap } = instance;

      if (xAxis.shouldUpdate || yAxis.shouldUpdate) instance.markShouldUpdate(context);

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            style: data.style,
            shape: data.shape,
            onClick: (e: MouseEvent) => {
               this.onLegendClick(e, instance);
            },
         });

      if (data.active) {
         if (context.pointReducer && isArray(data.data)) {
            data.data.forEach((p: any, index: number) => {
               context.pointReducer(p[this.xField], p[this.yField], data.name, p, data.data, index);
            });
         }
      }
   }

   onLegendClick(e: MouseEvent, instance: ScatterGraphInstance): void {
      var allActions = this.legendAction == "auto";
      var { data } = instance;
      if (allActions || this.legendAction == "toggle") instance.set("active", !data.active);
   }

   render(context: RenderingContext, instance: ScatterGraphInstance, key: string): React.ReactNode {
      var { data } = instance;
      return (
         <g key={key} className={data.classNames}>
            {this.renderData(context, instance)}
         </g>
      );
   }

   renderData(context: RenderingContext, instance: ScatterGraphInstance): React.ReactNode {
      var { data, xAxis, yAxis, store } = instance;

      if (!data.active) return null;

      var shape = getShape(data.shape);

      var isSelected = this.selection.getIsSelectedDelegate(store);

      return (
         isArray(data.data) &&
         data.data.map((p: any, i: number) => {
            var classes = CSS.element(this.baseClass, "shape", {
               selected: isSelected(p, i),
               selectable: !this.selection.isDummy,
               [`color-${data.colorIndex}`]: data.colorIndex != null,
            });

            var cx = xAxis.map(p[this.xField]),
               cy = yAxis.map(p[this.yField]),
               size = this.sizeField ? p[this.sizeField as string] : data.size;

            return shape(cx, cy, size, {
               key: i,
               className: classes,
               style: p.style || data.style,
               onClick: (e: React.MouseEvent) => {
                  this.handleItemClick(e, instance, i);
               },
            });
         })
      );
   }

   handleItemClick(e: React.MouseEvent, { data, store }: ScatterGraphInstance, index: number): void {
      var bubble = data.data[index];
      this.selection.select(store, bubble, index, {
         toggle: e.ctrlKey,
      });
   }
}

ScatterGraph.prototype.baseClass = "scattergraph";
ScatterGraph.prototype.xAxis = "x";
ScatterGraph.prototype.yAxis = "y";

ScatterGraph.prototype.xField = "x";
ScatterGraph.prototype.yField = "y";
ScatterGraph.prototype.sizeField = false;
ScatterGraph.prototype.shape = "circle";

ScatterGraph.prototype.size = 10;
ScatterGraph.prototype.legend = "legend";
ScatterGraph.prototype.legendAction = "auto";
ScatterGraph.prototype.styled = true;

Widget.alias("scatter-graph", ScatterGraph);
