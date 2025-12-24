/** @jsxImportSource react */

import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../svg/BoundedObject";
import { VDOM } from "../ui/Widget";
import { RenderingContext, CxChild } from "../ui/RenderingContext";
import type { ChartRenderingContext } from "./Chart";

export interface GridlinesConfig extends BoundedObjectConfig {
   /**
    * Name of the horizontal axis. The value should match one of the horizontal axes set
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    * Set to `false` to hide the grid lines in x direction.
    */
   xAxis?: string | boolean;

   /**
    * Name of the vertical axis. The value should match one of the vertical axes set
    * in the `axes` configuration if the parent `Chart` component. Default value is `y`.
    * Set to `false` to hide the grid lines in y direction.
    */
   yAxis?: string | boolean;

   /** Base CSS class to be applied to the element. Defaults to `gridlines`. */
   baseClass?: string;
}

export interface GridlinesInstance extends BoundedObjectInstance {
   xAxis?: any;
   yAxis?: any;
}

export class Gridlines extends BoundedObject<GridlinesConfig, GridlinesInstance> {
   declare xAxis: string;
   declare yAxis: string;
   declare anchors: string;
   declare baseClass: string;

   constructor(config?: GridlinesConfig) {
      super(config);
   }

   explore(context: ChartRenderingContext, instance: GridlinesInstance) {
      super.explore(context, instance);
      instance.xAxis = context.axes?.[this.xAxis];
      instance.yAxis = context.axes?.[this.yAxis];
   }

   prepare(context: ChartRenderingContext, instance: GridlinesInstance) {
      super.prepare(context, instance);
      let { xAxis, yAxis } = instance;
      if ((xAxis && xAxis.shouldUpdate) || (yAxis && yAxis.shouldUpdate)) instance.markShouldUpdate(context);
   }

   render(context: RenderingContext, instance: GridlinesInstance, key: string): CxChild {
      let { data, xAxis, yAxis } = instance;
      let { bounds } = data as any;
      let path = "",
         xTicks: number[],
         yTicks: number[];

      if (xAxis) {
         xTicks = xAxis.mapGridlines();
         xTicks.forEach((x) => {
            path += `M ${x} ${bounds.t} L ${x} ${bounds.b}`;
         });
      }

      if (yAxis) {
         yTicks = yAxis.mapGridlines();
         yTicks.forEach((y) => {
            path += `M ${bounds.l} ${y} L ${bounds.r} ${y}`;
         });
      }

      return (
         <g key={key} className={(data as any).classNames}>
            <path style={(data as any).style} d={path} />
         </g>
      );
   }
}

Gridlines.prototype.xAxis = "x";
Gridlines.prototype.yAxis = "y";
Gridlines.prototype.anchors = "0 1 1 0";
Gridlines.prototype.baseClass = "gridlines";

BoundedObject.alias("gridlines", Gridlines);
