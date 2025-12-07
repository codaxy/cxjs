/** @jsxImportSource react */

import { BoundedObject, BoundedObjectConfig, BoundedObjectInstance } from "../svg/BoundedObject";
import { VDOM } from "../ui/Widget";
import { captureMouseOrTouch, getCursorPos } from "../widgets/overlay/captureMouse";
import { closest } from "../util/DOM";
import { getTopLevelBoundingClientRect } from "../util/getTopLevelBoundingClientRect";
import { RenderingContext } from "../ui/RenderingContext";
import { Rect } from "../svg/util/Rect";
import { NumberProp, BooleanProp, StringProp } from "../ui/Prop";
import { Instance } from "../ui/Instance";
import type { ChartRenderingContext } from "./Chart";

export interface RangeConfig extends BoundedObjectConfig {
   /** The `x1` value binding or expression. */
   x1?: NumberProp;

   /** The `y1` value binding or expression. */
   y1?: NumberProp;

   /** The `x2` value binding or expression. */
   x2?: NumberProp;

   /** The `y2` value binding or expression. */
   y2?: NumberProp;

   /** Index of a color from the standard palette of colors. 0-15. */
   colorIndex?: NumberProp;

   /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
   active?: BooleanProp;

   /** Name of the item as it will appear in the legend. */
   name?: StringProp;

   /** Name of the legend to be used. Default is `legend`. */
   legend?: StringProp;

   /** Set to `true` to hide the range rectangle. */
   invisible?: boolean;

   /**
    * Name of the horizontal axis. The value should match one of the horizontal axes set
    * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
    */
   xAxis?: string;

   /**
    * Name of the vertical axis. The value should match one of the vertical axes set
    * in the `axes` configuration if the parent `Chart` component. Default value is `y`.
    */
   yAxis?: string;

   /** X size. */
   xSize?: number;

   /** Y size. */
   ySize?: number;

   /** X offset. */
   xOffset?: number;

   /** Y offset. */
   yOffset?: number;

   /** Set to `true` to make the range draggable along the X axis. */
   draggableX?: boolean;

   /** Set to `true` to make the range draggable along the Y axis. */
   draggableY?: boolean;

   /** Set to `true` to make the range draggable along the X and Y axis. */
   draggable?: boolean;

   /** Constrain the range position to min/max values of the X axis during drag operations. */
   constrainX?: boolean;

   /** Constrain the range position to min/max values of the Y axis during drag operations. */
   constrainY?: boolean;

   /** When set to `true`, it is equivalent to setting `constrainX` and `constrainY` to true. */
   constrain?: boolean;

   /** Action to perform on legend item click. Default is `auto`. */
   legendAction?: string;

   /** Set to `true` to hide the range. */
   hidden?: boolean;

   /** Click event handler. */
   onClick?: (e: React.MouseEvent, instance: Instance) => void;
}

export interface RangeInstance extends BoundedObjectInstance {
   xAxis: any;
   yAxis: any;
}

export class Range extends BoundedObject {
   declare baseClass: string;
   declare xAxis: string;
   declare yAxis: string;
   declare xSize: number;
   declare ySize: number;
   declare xOffset: number;
   declare yOffset: number;
   declare legend: string;
   declare legendAction: string;
   declare invisible: boolean;
   declare hidden: boolean;
   declare draggableX: boolean;
   declare draggableY: boolean;
   declare constrainX: boolean;
   declare constrainY: boolean;
   declare onClick: RangeConfig["onClick"];

   constructor(config: RangeConfig) {
      super(config);
   }

   declareData(...args: any[]): void {
      super.declareData(...args, {
         x1: undefined,
         y1: undefined,
         x2: undefined,
         y2: undefined,
         colorIndex: undefined,
         active: true,
         name: undefined,
         legend: undefined,
      });
   }

   explore(context: RenderingContext, instance: RangeInstance): void {
      var { data } = instance;
      var xAxis = (instance.xAxis = context.axes[this.xAxis]);
      var yAxis = (instance.yAxis = context.axes[this.yAxis]);

      if (data.active) {
         if (xAxis) {
            if (data.x1 != null) instance.xAxis.acknowledge(data.x1, this.xSize, this.xOffset);

            if (data.x2 != null) instance.xAxis.acknowledge(data.x2, this.xSize, this.xOffset);
         }

         if (yAxis) {
            if (data.y1 != null) instance.yAxis.acknowledge(data.y1, this.ySize, this.yOffset);

            if (data.y2 != null) instance.yAxis.acknowledge(data.y2, this.ySize, this.yOffset);
         }

         super.explore(context, instance);
      }
   }

   prepare(context: RenderingContext, instance: RangeInstance): void {
      super.prepare(context, instance);

      var { data, xAxis, yAxis } = instance;

      if (xAxis && xAxis.shouldUpdate) instance.markShouldUpdate(context);

      if (yAxis && yAxis.shouldUpdate) instance.markShouldUpdate(context);

      if (data.name && data.legend && context.addLegendEntry)
         context.addLegendEntry(data.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            style: data.style,
            shape: "rect",
            onClick: (e: MouseEvent) => {
               this.onLegendClick(e, instance);
            },
         });
   }

   onLegendClick(e: MouseEvent, instance: RangeInstance): void {
      var allActions = this.legendAction == "auto";
      var { data } = instance;
      if (allActions || this.legendAction == "toggle") instance.set("active", !data.active);
   }

   calculateBounds(context: RenderingContext, instance: RangeInstance): Rect {
      var bounds = super.calculateBounds(context, instance);
      var { data, xAxis, yAxis } = instance;

      if (data.x1 != null) bounds.l = xAxis.map(data.x1, this.xOffset - this.xSize / 2);

      if (data.x2 != null) bounds.r = xAxis.map(data.x2, this.xOffset + this.xSize / 2);

      if (data.y1 != null) bounds.t = yAxis.map(data.y1, this.yOffset - this.ySize / 2);

      if (data.y2 != null) bounds.b = yAxis.map(data.y2, this.yOffset + this.ySize / 2);

      return bounds;
   }

   render(context: RenderingContext, instance: RangeInstance, key: string): React.ReactNode {
      var { data } = instance;

      if (!data.active) return null;

      var { bounds } = data;
      var x1 = Math.min(bounds.l, bounds.r),
         y1 = Math.min(bounds.t, bounds.b),
         x2 = Math.max(bounds.l, bounds.r),
         y2 = Math.max(bounds.t, bounds.b);

      var stateMods: Record<string, boolean> = {
         ["color-" + data.colorIndex]: data.colorIndex != null,
      };

      return (
         <g key={key} className={data.classNames}>
            {!this.hidden && (
               <rect
                  className={this.CSS.element(this.baseClass, "rect", stateMods)}
                  style={data.style}
                  x={x1}
                  y={y1}
                  width={x2 - x1}
                  height={y2 - y1}
                  onMouseDown={(e) => this.handleMouseDown(e, instance)}
                  onTouchStart={(e) => this.handleMouseDown(e, instance)}
               />
            )}
            {this.renderChildren(context, instance)}
         </g>
      );
   }

   handleClick(e: React.MouseEvent, instance: RangeInstance): void {
      if (this.onClick) instance.invoke("onClick", e, instance);
   }

   handleMouseDown(e: React.MouseEvent | React.TouchEvent, instance: RangeInstance): void {
      if (this.draggableX || this.draggableY) {
         var svgEl = closest(e.target as Element, (el) => el.tagName == "svg");
         var svgBounds = getTopLevelBoundingClientRect(svgEl!);
         var cursor = getCursorPos(e);
         var { data, xAxis, yAxis } = instance;

         var captureData: any = {
            svgBounds,
            start: {
               x1: data.x1,
               x2: data.x2,
               y1: data.y1,
               y2: data.y2,
            },
         };

         if (this.draggableX && xAxis)
            captureData.start.x = xAxis.trackValue(cursor.clientX - svgBounds.left, this.xOffset, this.constrainX);

         if (this.draggableY && yAxis)
            captureData.start.y = yAxis.trackValue(cursor.clientY - svgBounds.top, this.yOffset, this.constrainY);

         if (svgEl)
            captureMouseOrTouch(
               e,
               (e, captureData) => {
                  this.handleDragMove(e, instance, captureData);
               },
               undefined,
               captureData,
               (e.target as HTMLElement).style.cursor
            );
      }
   }

   handleDragMove(e: MouseEvent | TouchEvent, instance: RangeInstance, captureData: any): void {
      var cursor = getCursorPos(e);
      var { xAxis, yAxis } = instance;
      var { svgBounds, start } = captureData;
      if (this.draggableX && xAxis) {
         var dist =
            xAxis.trackValue(cursor.clientX - svgBounds.left, this.xOffset, this.constrainX) - captureData.start.x;
         var x1v = xAxis.decodeValue(captureData.start.x1);
         var x2v = xAxis.decodeValue(captureData.start.x2);
         if (this.constrainX) {
            if (dist > 0) dist = Math.min(xAxis.constrainValue(x2v + dist) - x2v, dist);
            else dist = Math.max(xAxis.constrainValue(x1v + dist) - x1v, dist);
         }
         instance.set("x1", xAxis.encodeValue(x1v + dist));
         instance.set("x2", xAxis.encodeValue(x2v + dist));
      }

      if (this.draggableY && yAxis) {
         var dist =
            yAxis.trackValue(cursor.clientY - svgBounds.left, this.yOffset, this.constrainY) - captureData.start.y;
         var y1v = yAxis.decodeValue(captureData.start.y1);
         var y2v = yAxis.decodeValue(captureData.start.y2);
         if (this.constrainY)
            dist = Math.max(
               yAxis.constrainValue(y1v + dist) - y1v,
               Math.min(yAxis.constrainValue(y2v + dist) - y2v, dist)
            );
         instance.set("y1", yAxis.encodeValue(y1v + dist));
         instance.set("y2", yAxis.encodeValue(y2v + dist));
      }
   }
}

Range.prototype.invisible = false;
Range.prototype.xAxis = "x";
Range.prototype.yAxis = "y";
Range.prototype.xSize = 0;
Range.prototype.ySize = 0;
Range.prototype.xOffset = 0;
Range.prototype.yOffset = 0;
Range.prototype.anchors = "0 1 1 0";
Range.prototype.baseClass = "range";
Range.prototype.legend = "legend";
Range.prototype.legendAction = "auto";

BoundedObject.alias("range", Range);
