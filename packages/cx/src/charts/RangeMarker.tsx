/** @jsxImportSource react */

import {
  BoundedObject,
  BoundedObjectConfig,
  BoundedObjectInstance,
} from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { Widget, VDOM } from "../ui/Widget";
import { parseStyle } from "../util/parseStyle";
import { RenderingContext } from "../ui/RenderingContext";
import {
  NumberProp,
  BooleanProp,
  StringProp,
  StyleProp,
  Prop,
} from "../ui/Prop";
import type { ChartRenderingContext } from "./Chart";

export interface RangeMarkerConfig extends BoundedObjectConfig {
  /** The `x` value binding or expression. */
  x?: Prop<number | string | null>;

  /** The `y` value binding or expression. */
  y?: Prop<number | string | null>;

  /** The shape of marker, Could be `min`, `max`, `line`. Default to `line`. */
  shape?: StringProp;

  /** Switch to vertical mode. */
  vertical?: BooleanProp;

  /** Size of the range marker. */
  size?: NumberProp;

  /** The laneOffset property adjusts the positioning of lane elements, enhancing their alignment and readability. */
  laneOffset?: NumberProp;

  /** Style object applied to the range marker. */
  lineStyle?: StyleProp;

  /** Class object applied to the range marker. */
  lineClass?: StringProp;

  /** Size of vertical or horizontal caps. */
  capSize?: NumberProp;

  /** Inflate the range marker. */
  inflate?: NumberProp;

  /** Set to `true` to allow the range marker to affect axis bounds. */
  affectsAxes?: boolean;

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
}

export interface RangeMarkerInstance extends BoundedObjectInstance {
  axes: Record<string, any>;
  xAxis: any;
  yAxis: any;
}

export class RangeMarker extends BoundedObject {
  declare baseClass: string;
  declare xAxis: string;
  declare yAxis: string;
  declare shape: string;
  declare vertical: boolean;
  declare size: number;
  declare laneOffset: number;
  declare capSize: number;
  declare inflate: number;
  declare affectsAxes: boolean;
  declare lineStyle: any;

  constructor(config: RangeMarkerConfig) {
    super(config);
  }

  declareData(...args: any[]): void {
    super.declareData(...args, {
      x: undefined,
      y: undefined,
      shape: undefined,
      vertical: undefined,
      size: undefined,
      laneOffset: undefined,
      lineStyle: { structured: true },
      lineClass: { structured: true },
      capSize: undefined,
      inflate: undefined,
    });
  }

  init(): void {
    this.lineStyle = parseStyle(this.lineStyle);
    super.init();
  }

  prepareData(context: RenderingContext, instance: RangeMarkerInstance): void {
    instance.axes = context.axes;
    instance.xAxis = context.axes[this.xAxis];
    instance.yAxis = context.axes[this.yAxis];
    super.prepareData(context, instance);
  }

  explore(context: RenderingContext, instance: RangeMarkerInstance): void {
    let { data, xAxis, yAxis } = instance;

    if (this.affectsAxes) {
      if (xAxis && data.x != null) xAxis.acknowledge(data.x, 0, 0);
      if (yAxis && data.y != null) yAxis.acknowledge(data.y, 0, 0);
    }

    super.explore(context, instance);
  }

  calculateBounds(
    context: RenderingContext,
    instance: RangeMarkerInstance,
  ): Rect {
    let { data, xAxis, yAxis } = instance;

    let l: number, r: number, t: number, b: number;

    if (data.x == null || data.y == null) {
      return super.calculateBounds(context, instance);
    }

    if (!this.vertical) {
      l = xAxis.map(data.x, data.laneOffset - data.size / 2) - data.inflate;
      r = xAxis.map(data.x, data.laneOffset + data.size / 2) + data.inflate;
      t = b = yAxis.map(data.y);
      if (data.shape == "max") {
        b += data.capSize;
      } else if (data.shape == "min") {
        t -= data.capSize;
      }
    } else {
      l = r = xAxis.map(data.x);
      t = yAxis.map(data.y, data.laneOffset - data.size / 2) + data.inflate;
      b = yAxis.map(data.y, data.laneOffset + data.size / 2) - data.inflate;
      if (data.shape == "max") {
        l -= data.capSize;
      } else if (data.shape == "min") {
        r += data.capSize;
      }
    }

    return new Rect({
      l,
      r,
      t,
      b,
    });
  }

  prepare(context: RenderingContext, instance: RangeMarkerInstance): void {
    super.prepare(context, instance);
  }

  render(
    context: RenderingContext,
    instance: RangeMarkerInstance,
    key: string,
  ): React.ReactNode {
    var { data } = instance;
    let { CSS, baseClass } = this;
    let { bounds, shape } = data;

    let path = "";
    if (this.vertical) {
      switch (shape) {
        default:
        case "line":
          path += `M ${bounds.r} ${bounds.t} `;
          path += `L ${bounds.r} ${bounds.b}`;
          break;
        case "max":
          path += `M ${bounds.l} ${bounds.t} `;
          path += `L ${bounds.r} ${bounds.t}`;
          path += `L ${bounds.r} ${bounds.b}`;
          path += `L ${bounds.l} ${bounds.b}`;
          break;
        case "min":
          path += `M ${bounds.r} ${bounds.t} `;
          path += `L ${bounds.l} ${bounds.t}`;
          path += `L ${bounds.l} ${bounds.b}`;
          path += `L ${bounds.r} ${bounds.b}`;
          break;
      }
    } else {
      switch (shape) {
        default:
        case "line":
          path += `M ${bounds.r} ${bounds.t} `;
          path += `L ${bounds.l} ${bounds.t}`;
          break;
        case "max":
          path += `M ${bounds.l} ${bounds.b} `;
          path += `L ${bounds.l} ${bounds.t}`;
          path += `L ${bounds.r} ${bounds.t}`;
          path += `L ${bounds.r} ${bounds.b}`;
          break;
        case "min":
          path += `M ${bounds.l} ${bounds.t} `;
          path += `L ${bounds.l} ${bounds.b}`;
          path += `L ${bounds.r} ${bounds.b}`;
          path += `L ${bounds.r} ${bounds.t}`;
          break;
      }
    }

    return (
      <g key={key} className={data.classNames} style={data.style}>
        <path
          d={path}
          className={CSS.expand(CSS.element(baseClass, "path"), data.lineClass)}
          style={data.lineStyle}
        />
        {this.renderChildren(context, instance)}
      </g>
    );
  }
}

RangeMarker.prototype.baseClass = "rangemarker";
RangeMarker.prototype.xAxis = "x";
RangeMarker.prototype.yAxis = "y";

RangeMarker.prototype.shape = "line";
RangeMarker.prototype.vertical = false;
RangeMarker.prototype.size = 1;
RangeMarker.prototype.laneOffset = 0;
RangeMarker.prototype.capSize = 5;
RangeMarker.prototype.inflate = 0;
RangeMarker.prototype.affectsAxes = true;

Widget.alias("range-marker", RangeMarker);
