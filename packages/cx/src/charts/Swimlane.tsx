/** @jsxImportSource react */

import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../svg/BoundedObject";
import { parseStyle } from "../util/parseStyle";
import { VDOM } from "../ui/Widget";
import { Rect } from "../svg/util/Rect";
import { RenderingContext, CxChild } from "../ui/RenderingContext";
import { Prop, NumberProp, StyleProp } from "../core";

export interface SwimlaneConfig extends BoundedObjectConfig {
   /** The `x` value binding or expression. */
   x?: Prop<string | number>;

   /** The `y` value binding or expression. */
   y?: Prop<string | number>;

   /** Represents a swimlane size. */
   size?: NumberProp;

   /** Switch to vertical swimlanes. */
   vertical?: boolean;

   /** The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and readability. */
   laneOffset?: NumberProp;

   /** Style object applied to the swimlanes. */
   laneStyle?: StyleProp;

   /** Name of the x-axis. Default is 'x'. */
   xAxis?: string;

   /** Name of the y-axis. Default is 'y'. */
   yAxis?: string;
}

export interface SwimlaneInstance extends BoundedObjectInstance {
   xAxis?: any;
   yAxis?: any;
   bounds?: Rect;
}

export class Swimlane extends BoundedObject<SwimlaneConfig, SwimlaneInstance> {
   declare xAxis: string;
   declare yAxis: string;
   declare anchors: string;
   declare baseClass: string;
   declare size: number;
   declare laneOffset: number;
   declare vertical: boolean;
   declare laneStyle: any;
   declare CSS: any;

   constructor(config?: SwimlaneConfig) {
      super(config);
   }

   init() {
      this.laneStyle = parseStyle(this.laneStyle);
      super.init();
   }

   declareData(...args: any[]) {
      super.declareData(...args, {
         size: undefined,
         laneOffset: undefined,
         laneStyle: { structured: true },
         vertical: undefined,
         x: undefined,
         y: undefined,
      });
   }

   explore(context: RenderingContext, instance: SwimlaneInstance) {
      let { data } = instance;
      super.explore(context, instance);
      instance.xAxis = (context.axes as any)?.[this.xAxis];
      instance.yAxis = (context.axes as any)?.[this.yAxis];

      const d = data as any;
      if (d.vertical) {
         instance.xAxis.acknowledge(d.x, d.size, d.laneOffset);
      } else {
         instance.yAxis.acknowledge(d.y, d.size, d.laneOffset);
      }
   }

   prepare(context: RenderingContext, instance: SwimlaneInstance) {
      super.prepare(context, instance);
      instance.bounds = this.calculateRect(instance);
      instance.cache("bounds", instance.bounds);
      if (!instance.bounds.isEqual((instance.cached as any).bounds)) instance.markShouldUpdate(context);

      context.push("parentRect", instance.bounds);
   }

   calculateRect(instance: SwimlaneInstance): Rect {
      var { data } = instance;
      const d = data as any;
      var { size, laneOffset } = d;
      let bounds: Rect;

      if (d.vertical) {
         var x1 = instance.xAxis.map(d.x, laneOffset - size / 2);
         var x2 = instance.xAxis.map(d.x, laneOffset + size / 2);
         bounds = new Rect({
            l: Math.min(x1, x2),
            r: Math.max(x1, x2),
            t: d.bounds.t,
            b: d.bounds.b,
         });
      } else {
         var y1 = instance.yAxis.map(d.y, laneOffset - size / 2);
         var y2 = instance.yAxis.map(d.y, laneOffset + size / 2);
         bounds = new Rect({
            l: d.bounds.l,
            r: d.bounds.r,
            t: Math.min(y1, y2),
            b: Math.max(y1, y2),
         });
      }

      return bounds;
   }

   render(context: RenderingContext, instance: SwimlaneInstance, key: string): CxChild {
      let { data, xAxis, yAxis, bounds } = instance;
      let { CSS, baseClass } = this;
      const d = data as any;

      let axis = this.vertical ? xAxis : yAxis;
      if (!axis) return null;

      let min: number, max: number, valueFunction: (value: any, offset: number) => [any, number];
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

      let rectClass = CSS.element(baseClass, "lane");

      if (this.vertical) {
         let c1 = axis.map(...valueFunction!(d.x, -d.size / 2 + d.laneOffset));
         let c2 = axis.map(...valueFunction!(d.x, +d.size / 2 + d.laneOffset));
         return (
            <g key={key} className={d.classNames}>
               <rect
                  key={key}
                  x={bounds!.l}
                  y={bounds!.t}
                  height={bounds!.b - bounds!.t}
                  width={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={d.laneStyle}
               />
               {this.renderChildren(context, instance)};
            </g>
         );
      } else {
         let c1 = axis.map(...valueFunction!(d.y, -d.size / 2 + d.laneOffset));
         let c2 = axis.map(...valueFunction!(d.y, +d.size / 2 + d.laneOffset));
         return (
            <g key={key} className={d.classNames}>
               <rect
                  key={key}
                  x={bounds!.l}
                  y={bounds!.t}
                  width={bounds!.r - bounds!.l}
                  height={Math.abs(c1 - c2)}
                  className={rectClass}
                  style={d.laneStyle}
               />
               {this.renderChildren(context, instance)};
            </g>
         );
      }
   }
}

Swimlane.prototype.xAxis = "x";
Swimlane.prototype.yAxis = "y";
Swimlane.prototype.anchors = "0 1 1 0";
Swimlane.prototype.baseClass = "swimlane";
Swimlane.prototype.size = 0.5;
Swimlane.prototype.laneOffset = 0;
Swimlane.prototype.vertical = false;

BoundedObject.alias("swimlane", Swimlane);
