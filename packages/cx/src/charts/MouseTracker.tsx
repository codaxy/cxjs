/** @jsxImportSource react */

import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../svg/BoundedObject";
import { VDOM } from "../ui/VDOM";
import { tooltipMouseMove, tooltipMouseLeave, TooltipParentInstance } from "../widgets/overlay/tooltip-ops";
import { closest } from "../util/DOM";
import { getTopLevelBoundingClientRect } from "../util/getTopLevelBoundingClientRect";
import { RenderingContext, CxChild } from "../ui/RenderingContext";
import { NumberProp } from "../ui/Prop";
import type { ChartRenderingContext } from "./Chart";

export interface MouseTrackerConfig extends BoundedObjectConfig {
   /** The binding that is used to store the mouse x coordinate. */
   x?: NumberProp;

   /** The binding that is used to store the mouse y coordinate. */
   y?: NumberProp;

   /** Base CSS class to be applied to the element. Defaults to `mousetracker`. */
   baseClass?: string;

   /** Name of the x-axis. Default is 'x'. */
   xAxis?: string;

   /** Name of the y-axis. Default is 'y'. */
   yAxis?: string;
}

export interface MouseTrackerInstance extends BoundedObjectInstance, TooltipParentInstance {
   xAxis?: any;
   yAxis?: any;
}

export class MouseTracker extends BoundedObject<MouseTrackerConfig, MouseTrackerInstance> {
   declare xAxis: string;
   declare yAxis: string;
   declare anchors: string;
   declare baseClass: string;

   constructor(config?: MouseTrackerConfig) {
      super(config);
   }

   declareData(...args: any[]) {
      return super.declareData(...args, {
         x: undefined,
         y: undefined,
      });
   }

   explore(context: ChartRenderingContext, instance: MouseTrackerInstance) {
      instance.xAxis = context.axes?.[this.xAxis];
      instance.yAxis = context.axes?.[this.yAxis];
      super.explore(context, instance);
   }

   render(context: RenderingContext, instance: MouseTrackerInstance, key: string): CxChild {
      let { data } = instance;
      let { bounds } = data as any;
      if (!bounds.valid()) return null;

      return (
         <g
            key={key}
            className={(data as any).classNames}
            onMouseMove={(e) => {
               this.handleMouseMove(e, instance);
            }}
            onMouseLeave={(e) => {
               this.handleMouseLeave(e, instance);
            }}
         >
            <rect
               x={bounds.l}
               y={bounds.t}
               width={bounds.width()}
               height={bounds.height()}
               fill="transparent"
               strokeWidth="0"
            />
            {this.renderChildren(context, instance)}
         </g>
      );
   }

   handleMouseMove(e: React.MouseEvent, instance: MouseTrackerInstance) {
      let { xAxis, yAxis } = instance;
      let svgEl = closest(e.target as Element, (el) => el.tagName == "svg");
      let bounds = getTopLevelBoundingClientRect(svgEl!);

      if (xAxis) instance.set("x", xAxis.trackValue(e.clientX - bounds.left));

      if (yAxis) instance.set("y", yAxis.trackValue(e.clientY - bounds.top));

      tooltipMouseMove(e, instance, (instance.widget as any).tooltip);
   }

   handleMouseLeave(e: React.MouseEvent, instance: MouseTrackerInstance) {
      let { xAxis, yAxis } = instance;

      tooltipMouseLeave(e, instance, (instance.widget as any).tooltip);

      if (xAxis) instance.set("x", null);

      if (yAxis) instance.set("y", null);
   }
}

MouseTracker.prototype.xAxis = "x";
MouseTracker.prototype.yAxis = "y";
MouseTracker.prototype.anchors = "0 1 1 0";
MouseTracker.prototype.baseClass = "mousetracker";
