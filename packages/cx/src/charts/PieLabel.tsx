/** @jsxImportSource react */

import { VDOM } from "../ui/Widget";
import {
  BoundedObject,
  BoundedObjectConfig,
  BoundedObjectInstance,
} from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import { parseStyle } from "../util/parseStyle";
import { RenderingContext } from "../ui/RenderingContext";
import { NumberProp, StringProp, StyleProp } from "../ui/Prop";

export interface PieLabelConfig extends BoundedObjectConfig {
  /** Distance from the pie center. Default is `100`. */
  distance?: NumberProp;

  /** Style for the connecting line. */
  lineStyle?: StyleProp;

  /** Stroke color for the connecting line. */
  lineStroke?: StringProp;

  /** CSS class for the connecting line. */
  lineClass?: StringProp;

  /** Color index for the connecting line. */
  lineColorIndex?: NumberProp;
}

export interface PieLabelInstance extends BoundedObjectInstance {
  originalBounds: Rect;
  actualBounds: Rect;
  parentRect: Rect;
}

export class PieLabel extends BoundedObject {
  declare baseClass: string;
  declare distance: number;
  declare lineStyle: any;

  constructor(config: PieLabelConfig) {
    super(config);
  }

  init(): void {
    this.lineStyle = parseStyle(this.lineStyle);
    super.init();
  }

  declareData(...args: any[]): void {
    super.declareData(...args, {
      distance: undefined,
      lineStyle: { structured: true },
      lineStroke: undefined,
      lineClass: { structured: true },
      lineColorIndex: undefined,
    });
  }

  calculateBounds(context: RenderingContext, instance: PieLabelInstance): Rect {
    var { data } = instance;
    var bounds = Rect.add(
      Rect.add(Rect.multiply(instance.parentRect, data.anchors), data.offset),
      data.margin,
    );
    instance.originalBounds = bounds;
    instance.actualBounds = context.placePieLabel(bounds, data.distance);
    return new Rect({ t: 0, r: bounds.width(), b: bounds.height(), l: 0 });
  }

  prepare(context: RenderingContext, instance: PieLabelInstance): void {
    super.prepare(context, instance);
    if (!context.registerPieLabel)
      throw new Error(
        "PieLabel components are allowed only within PieLabelsContainer components.",
      );
    let right = instance.parentRect.r > instance.parentRect.l;
    context.push("textDirection", right ? "right" : "left");
    context.registerPieLabel(instance);
  }

  prepareCleanup(context: RenderingContext, instance: PieLabelInstance): void {
    context.pop("textDirection");
    super.prepareCleanup(context, instance);
  }

  render(
    context: RenderingContext,
    instance: PieLabelInstance,
    key: string,
  ): React.ReactNode {
    let { originalBounds, actualBounds, data } = instance;

    return (
      <g key={key} className={data.classNames}>
        <line
          className={this.CSS.element(
            this.baseClass,
            "line",
            data.lineColorIndex != null && "color-" + data.lineColorIndex,
          )}
          x1={
            actualBounds.l < originalBounds.l ? actualBounds.r : actualBounds.l
          }
          y1={(actualBounds.t + actualBounds.b) / 2}
          x2={(originalBounds.l + originalBounds.r) / 2}
          y2={(originalBounds.t + originalBounds.b) / 2}
          stroke={data.lineStroke}
          style={data.lineStyle}
        />
        <g
          transform={`translate(${instance.actualBounds.l} ${instance.actualBounds.t})`}
        >
          {this.renderChildren(context, instance)}
        </g>
      </g>
    );
  }
}

PieLabel.prototype.distance = 100;
PieLabel.prototype.baseClass = "pielabel";
PieLabel.prototype.styled = true;
