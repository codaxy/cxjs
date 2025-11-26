/** @jsxImportSource react */

import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../svg/BoundedObject";
import { parseStyle } from "../util/parseStyle";
import { VDOM } from "../ui/Widget";
import { RenderingContext, CxChild } from "../ui/RenderingContext";
import { NumberProp, StyleProp } from "../ui/Prop";

export interface SwimlanesConfig extends BoundedObjectConfig {
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

   /** Base CSS class to be applied to the element. Defaults to `swimlanes`. */
   baseClass?: string;

   /** Represents a swimlane size. */
   size?: NumberProp;

   /**
    * Represents a swimlane step. Define a step on which a swimlane will be rendered. (eg. step 2 will render
    * every second swimlane in the chart.)
    */
   step?: NumberProp;

   /** Switch to vertical swimlanes. */
   vertical?: boolean;

   /** The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and readability. */
   laneOffset?: NumberProp;

   /** Style object applied to the swimlanes. */
   laneStyle?: StyleProp;
}

export interface SwimlanesInstance extends BoundedObjectInstance {
   xAxis?: any;
   yAxis?: any;
}

export class Swimlanes extends BoundedObject<SwimlanesConfig, SwimlanesInstance> {
   declare xAxis: string;
   declare yAxis: string;
   declare anchors: string;
   declare baseClass: string;
   declare size: number;
   declare laneOffset: number;
   declare step: number;
   declare vertical: boolean;
   declare styled: boolean;
   declare laneStyle: any;
   declare CSS: any;

   constructor(config?: SwimlanesConfig) {
      super(config);
   }

   init() {
      this.laneStyle = parseStyle(this.laneStyle);
      super.init();
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         size: undefined,
         step: undefined,
         laneOffset: undefined,
         laneStyle: { structured: true },
      });
   }

   explore(context: RenderingContext, instance: SwimlanesInstance) {
      super.explore(context, instance);
      instance.xAxis = (context.axes as any)?.[this.xAxis];
      instance.yAxis = (context.axes as any)?.[this.yAxis];
   }

   prepare(context: RenderingContext, instance: SwimlanesInstance) {
      super.prepare(context, instance);
      let { xAxis, yAxis } = instance;
      if ((xAxis && xAxis.shouldUpdate) || (yAxis && yAxis.shouldUpdate)) instance.markShouldUpdate(context);
   }

   render(context: RenderingContext, instance: SwimlanesInstance, key: string): CxChild {
      let { data, xAxis, yAxis } = instance;
      const d = data as any;
      let { bounds } = d;
      let { CSS, baseClass } = this;

      if (d.step <= 0 || d.size <= 0) return null;

      let axis = this.vertical ? xAxis : yAxis;

      if (!axis) return null;

      let min: number, max: number, valueFunction: (value: number, offset: number) => [any, number];

      if (axis.scale) {
         min = axis.scale.min;
         max = axis.scale.max;
         let clamp = (value: number): [number, number] => [Math.max(min, Math.min(max, value)), 0];
         valueFunction = (value, offset) => clamp(value + offset);
      } else if (axis.valueList) {
         min = 0;
         max = axis.valueList.length;
         valueFunction = (value, offset) => [axis.valueList[value], offset];
      }

      if (!(min! < max!)) return null;

      let rects: React.ReactElement[] = [];

      let at = Math.ceil(min! / d.step) * d.step;
      let index = 0;

      let rectClass = CSS.element(baseClass, "lane");

      while (at - d.size / 2 < max!) {
         let c1 = axis.map(...valueFunction!(at, -d.size / 2 + d.laneOffset));
         let c2 = axis.map(...valueFunction!(at, +d.size / 2 + d.laneOffset));
         if (this.vertical) {
            rects.push(
               <rect
                  key={index++}
                  y={bounds.t}
                  x={Math.min(c1, c2)}
                  height={bounds.b - bounds.t}
                  width={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={d.laneStyle}
               />
            );
         } else {
            rects.push(
               <rect
                  key={index++}
                  x={bounds.l}
                  y={Math.min(c1, c2)}
                  width={bounds.r - bounds.l}
                  height={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={d.laneStyle}
               />
            );
         }

         at += d.step;
      }

      return (
         <g key={key} className={d.classNames}>
            {rects}
         </g>
      );
   }
}

Swimlanes.prototype.xAxis = "x";
Swimlanes.prototype.yAxis = "y";
Swimlanes.prototype.anchors = "0 1 1 0";
Swimlanes.prototype.baseClass = "swimlanes";
Swimlanes.prototype.size = 0.5;
Swimlanes.prototype.laneOffset = 0;
Swimlanes.prototype.step = 1;
Swimlanes.prototype.vertical = false;
Swimlanes.prototype.styled = true;

BoundedObject.alias("swimlanes", Swimlanes);
