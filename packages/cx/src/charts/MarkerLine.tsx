/** @jsxImportSource react */

import {
  BoundedObject,
  BoundedObjectConfig,
  BoundedObjectInstance,
} from "../svg/BoundedObject";
import { VDOM } from "../ui/Widget";
import { isDefined } from "../util/isDefined";
import { Rect } from "../svg/util/Rect";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, BooleanProp, StringProp, Prop } from "../ui/Prop";
import type { ChartRenderingContext } from "./Chart";

export interface MarkerLineConfig extends BoundedObjectConfig {
  /** X coordinate for vertical line. */
  x?: Prop<string | number | Date | null>;

  /** Y coordinate for horizontal line. */
  y?: Prop<string | number | Date | null>;

  /** Starting X coordinate. */
  x1?: Prop<string | number | Date | null>;

  /** Starting Y coordinate. */
  y1?: Prop<string | number | Date | null>;

  /** Ending X coordinate. */
  x2?: Prop<string | number | Date | null>;

  /** Ending Y coordinate. */
  y2?: Prop<string | number | Date | null>;

  /** Index of a color from the standard palette of colors. 0-15. */
  colorIndex?: NumberProp;

  /** Used to indicate if the line is active or not. */
  active?: BooleanProp;

  /** Name of the line as it will appear in the legend. */
  name?: StringProp;

  /** Name of the legend to be used. Default is `legend`. */
  legend?: StringProp;

  /** Name of the horizontal axis. Default value is `x`. */
  xAxis?: string;

  /** Name of the vertical axis. Default value is `y`. */
  yAxis?: string;

  /** Set to `false` to prevent the line from affecting axis bounds. */
  affectsAxes?: boolean;

  /** Action to perform on legend item click. Default is `auto`. */
  legendAction?: string;
}

export interface MarkerLineInstance extends BoundedObjectInstance {
  xAxis: any;
  yAxis: any;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
}

export class MarkerLine extends BoundedObject {
  declare baseClass: string;
  declare xAxis: string;
  declare yAxis: string;
  declare legend: string;
  declare legendAction: string;
  declare affectsAxes: boolean;
  declare x: number;
  declare y: number;
  declare x1: number;
  declare x2: number;
  declare y1: number;
  declare y2: number;

  constructor(config: MarkerLineConfig) {
    super(config);
  }

  init(): void {
    if (isDefined(this.x)) this.x1 = this.x2 = this.x;

    if (isDefined(this.y)) this.y1 = this.y2 = this.y;

    super.init();
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

  explore(context: RenderingContext, instance: MarkerLineInstance): void {
    let { data } = instance;

    let xAxis = (instance.xAxis = context.axes[this.xAxis]);
    let yAxis = (instance.yAxis = context.axes[this.yAxis]);

    if (data.active) {
      if (this.affectsAxes) {
        if (data.x1 != null) xAxis.acknowledge(data.x1);

        if (data.x2 != null) xAxis.acknowledge(data.x2);

        if (data.y1 != null) yAxis.acknowledge(data.y1);

        if (data.y2 != null) yAxis.acknowledge(data.y2);
      }

      super.explore(context, instance);
    }
  }

  prepare(context: RenderingContext, instance: MarkerLineInstance): void {
    let { data, xAxis, yAxis } = instance;

    if ((xAxis && xAxis.shouldUpdate) || (yAxis && yAxis.shouldUpdate))
      instance.markShouldUpdate(context);

    super.prepare(context, instance);

    if (data.name && data.legend && context.addLegendEntry)
      context.addLegendEntry(data.legend, {
        name: data.name,
        active: data.active,
        colorIndex: data.colorIndex,
        style: data.style,
        shape: "line",
        onClick: (e: MouseEvent) => {
          this.onLegendClick(e, instance);
        },
      });
  }

  calculateBounds(
    context: RenderingContext,
    instance: MarkerLineInstance,
  ): Rect {
    let { data, xAxis, yAxis } = instance;
    let bounds = super.calculateBounds(context, instance);

    let x1 = bounds.l,
      x2 = bounds.r,
      y1 = bounds.t,
      y2 = bounds.b;

    if (data.x1 != null) x1 = xAxis.map(data.x1);

    if (data.x2 != null) x2 = xAxis.map(data.x2);

    if (data.y1 != null) y1 = yAxis.map(data.y1);

    if (data.y2 != null) y2 = yAxis.map(data.y2);

    bounds.l = Math.min(x1, x2);
    bounds.t = Math.min(y1, y2);
    bounds.r = Math.max(x1, x2);
    bounds.b = Math.max(y1, y2);

    instance.x1 = x1;
    instance.x2 = x2;
    instance.y1 = y1;
    instance.y2 = y2;

    return bounds;
  }

  onLegendClick(e: MouseEvent, instance: MarkerLineInstance): void {
    let allActions = this.legendAction == "auto";
    let { data } = instance;
    if (allActions || this.legendAction == "toggle")
      instance.set("active", !data.active);
  }

  render(
    context: RenderingContext,
    instance: MarkerLineInstance,
    key: string,
  ): React.ReactNode {
    let { data, x1, x2, y1, y2 } = instance;

    if (
      !data.active ||
      data.x1 === null ||
      data.x2 === null ||
      data.y1 === null ||
      data.y2 === null
    )
      return null;

    let stateMods: Record<string, boolean> = {
      ["color-" + data.colorIndex]: data.colorIndex != null,
    };

    return (
      <g key={key} className={data.classNames}>
        <line
          className={this.CSS.element(this.baseClass, "line", stateMods)}
          style={data.style}
          x1={x1}
          y1={y1}
          x2={x2}
          y2={y2}
        />
        {this.renderChildren(context, instance)}
      </g>
    );
  }
}

MarkerLine.prototype.xAxis = "x";
MarkerLine.prototype.yAxis = "y";
MarkerLine.prototype.anchors = "0 1 1 0";
MarkerLine.prototype.baseClass = "markerline";
MarkerLine.prototype.legend = "legend";
MarkerLine.prototype.legendAction = "auto";
MarkerLine.prototype.affectsAxes = true;

BoundedObject.alias("marker-line", MarkerLine);
