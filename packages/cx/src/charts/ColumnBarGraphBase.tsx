/** @jsxImportSource react */

import { Widget, VDOM, WidgetConfig } from "../ui/Widget";
import { Selection } from "../ui/selection/Selection";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp, StringProp, RecordsProp } from "../ui/Prop";
import type { ChartRenderingContext } from "./Chart";

export interface ColumnBarGraphBaseConfig extends WidgetConfig {
   /**
    * Data for the graph. Each entry should be an object with at least two properties
    * whose names should match the `xField` and `yField` values.
    */
   data?: RecordsProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: NumberProp;

   /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
   colorMap?: StringProp;

   /** Name used to resolve the color. If not provided, `name` is used instead. */
   colorName?: StringProp;

   /** Name of the item as it will appear in the legend. */
   name?: StringProp;

   /** Size (width) of the column in axis units. */
   size?: NumberProp;

   /** Of center offset of the column. Use this in combination with `size` to align multiple series on the same chart. */
   offset?: NumberProp;

   /** Set to true to auto-calculate size and offset. Available only if the x axis is a category axis. */
   autoSize?: BooleanProp;

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: BooleanProp;

   /** Indicate that columns should be stacked on top of the other columns. Default value is `false`. */
   stacked?: BooleanProp;

   /** Border radius of the column/bar. */
   borderRadius?: NumberProp;

   /** Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`. */
   stack?: StringProp;

   /** Column/bar base value for y axis. */
   y0?: NumberProp;

   /** Column/bar base value for x axis. */
   x0?: NumberProp;

   /** Name of the horizontal axis. Default value is `x`. */
   xAxis?: string;

   /** Name of the vertical axis. Default value is `y`. */
   yAxis?: string;

   /** Name of the property which holds the x value. Default value is `x`. */
   xField?: string;

   /** Name of the property which holds the y value. Default value is `y`. */
   yField?: string;

   colorIndexField?: boolean | string;

   /** Name of the legend to be used. Default is `legend`. Set to `false` to hide the legend entry. */
   legend?: string | false;

   legendAction?: string;
   legendShape?: string;

   /** Selection configuration. */
   selection?: any;

   onClick?: (e: MouseEvent, instance: Instance, point: any, index: number) => void | false;
}

export interface ColumnBarGraphBaseInstance extends Instance {
   xAxis: any;
   yAxis: any;
   colorMap: any;
}

export class ColumnBarGraphBase extends Widget<ColumnBarGraphBaseConfig> {
   declare baseClass: string;
   declare xAxis: string;
   declare yAxis: string;
   declare xField: string;
   declare yField: string;
   declare colorIndexField: boolean | string;
   declare size: number;
   declare legend: string | false;
   declare legendAction: string;
   declare legendShape: string;
   declare stack: string;
   declare stacked: boolean;
   declare autoSize: number | boolean;
   declare offset: number;
   declare borderRadius: number;
   declare selection: Selection;
   declare data: any;
   declare onClick: ColumnBarGraphBaseConfig["onClick"];

   constructor(config?: ColumnBarGraphBaseConfig) {
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
         selection,
         {
            data: undefined,
            colorIndex: undefined,
            colorMap: undefined,
            colorName: undefined,
            name: undefined,
            size: undefined,
            offset: undefined,
            y0: undefined,
            x0: undefined,
            autoSize: undefined,
            active: true,
            stacked: undefined,
            stack: undefined,
            borderRadius: undefined,
         },
         ...args,
      );
   }

   prepareData(context: RenderingContext, instance: ColumnBarGraphBaseInstance): void {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context: ChartRenderingContext, instance: ColumnBarGraphBaseInstance): void {
      instance.xAxis = context.axes![this.xAxis];
      instance.yAxis = context.axes![this.yAxis];

      var { data } = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      super.explore(context, instance);
   }

   prepare(context: ChartRenderingContext, instance: ColumnBarGraphBaseInstance): void {
      let { data, colorMap, xAxis, yAxis } = instance;

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }

      if (xAxis.shouldUpdate || yAxis.shouldUpdate) instance.markShouldUpdate(context);

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            selected: this.selection.isInstanceSelected(instance),
            style: data.style,
            shape: this.legendShape,
            onClick: (e: MouseEvent) => {
               this.onLegendClick(e, instance);
            },
         });
   }

   onLegendClick(e: MouseEvent, instance: ColumnBarGraphBaseInstance): void {
      var allActions = this.legendAction == "auto";
      var { data } = instance;
      if (allActions || this.legendAction == "toggle") instance.set("active", !data.active);
   }

   render(context: RenderingContext, instance: ColumnBarGraphBaseInstance, key: string): React.ReactNode {
      var { data } = instance;
      return (
         <g key={key} className={data.classNames}>
            {data.active && this.renderGraph(context, instance)}
         </g>
      );
   }

   renderGraph(context: RenderingContext, instance: ColumnBarGraphBaseInstance): React.ReactNode {
      throw new Error("Abstract method");
   }

   handleClick(e: React.MouseEvent, instance: ColumnBarGraphBaseInstance, point: any, index: number): void {
      if (this.onClick && instance.invoke("onClick", e, instance, point, index) === false) return;

      if (!this.selection.isDummy) this.selection.select(instance.store, point, index, { toggle: e.ctrlKey });
   }
}

ColumnBarGraphBase.prototype.xAxis = "x";
ColumnBarGraphBase.prototype.yAxis = "y";
ColumnBarGraphBase.prototype.xField = "x";
ColumnBarGraphBase.prototype.yField = "y";
ColumnBarGraphBase.prototype.colorIndexField = false;
ColumnBarGraphBase.prototype.size = 1;
ColumnBarGraphBase.prototype.legend = "legend";
ColumnBarGraphBase.prototype.legendAction = "auto";
ColumnBarGraphBase.prototype.legendShape = "rect";
ColumnBarGraphBase.prototype.stack = "stack";
ColumnBarGraphBase.prototype.stacked = false;
ColumnBarGraphBase.prototype.autoSize = 0;
ColumnBarGraphBase.prototype.offset = 0;
ColumnBarGraphBase.prototype.styled = true;
ColumnBarGraphBase.prototype.borderRadius = 0;
