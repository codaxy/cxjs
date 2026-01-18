/** @jsxImportSource react */

import { Widget, VDOM } from "../ui/Widget";
import {
  BoundedObject,
  BoundedObjectConfig,
  BoundedObjectInstance,
} from "../svg/BoundedObject";
import { Rect } from "../svg/util/Rect";
import {
  tooltipMouseMove,
  tooltipMouseLeave,
  tooltipParentWillUnmount,
  tooltipParentWillReceiveProps,
  tooltipParentDidMount,
  tooltipParentDidUpdate,
  TooltipParentInstance,
  TooltipConfig,
} from "../widgets/overlay/tooltip-ops";
import {
  captureMouseOrTouch,
  getCursorPos,
} from "../widgets/overlay/captureMouse";
import { closest } from "../util/DOM";
import { Selection } from "../ui/selection/Selection";
import { getShape } from "./shapes";
import { getTopLevelBoundingClientRect } from "../util/getTopLevelBoundingClientRect";
import { RenderingContext } from "../ui/RenderingContext";
import {
  NumberProp,
  BooleanProp,
  StringProp,
  StructuredProp,
} from "../ui/Prop";
import { Instance } from "../ui/Instance";
import type { ChartRenderingContext } from "./Chart";

export interface MarkerConfig extends BoundedObjectConfig {
  /** The `x` value binding or expression. */
  x?: NumberProp | StringProp;

  /** The `y` value binding or expression. */
  y?: NumberProp | StringProp;

  /** Used to indicate if the data should affect axis span. */
  affectsAxes?: boolean;

  /** Shape kind. `circle`, `square`, `triangle`, etc. */
  shape?: StringProp;

  /** Disabled state. */
  disabled?: BooleanProp;

  /** Index of a color from the standard palette of colors. 0-15. */
  colorIndex?: NumberProp | StringProp;

  /** Used to automatically assign a color based on the `name` and the contextual `ColorMap` widget. */
  colorMap?: StringProp;

  /** Name used to resolve the color. If not provided, `name` is used instead. */
  colorName?: StringProp;

  /** Color index to use for the legend entry. */
  legendColorIndex?: NumberProp;

  /** Name of the item as it will appear in the legend. */
  name?: StringProp;

  /** Used to indicate if an item is active or not. Inactive items are shown only in the legend. */
  active?: BooleanProp;

  /** X offset. */
  xOffset?: number;

  /** Y offset. */
  yOffset?: number;

  /** Size of the shape in pixels. */
  size?: NumberProp;

  /**
   * Name of the horizontal axis. The value should match one of the horizontal axes set
   * in the `axes` configuration of the parent `Chart` component. Default value is `x`.
   */
  xAxis?: string;

  /**
   * Name of the vertical axis. The value should match one of the vertical axes set
   *  in the `axes` configuration if the parent `Chart` component. Default value is `y`.
   */
  yAxis?: string;

  /** Set to `true` to make the shape draggable along the X axis. */
  draggableX?: boolean;

  /** Set to `true` to make the shape draggable along the Y axis. */
  draggableY?: boolean;

  /** Set to `true` to make the shape draggable along the X and Y axis. */
  draggable?: boolean;

  /** Constrain the marker position to min/max values of the X axis during drag operations. */
  constrainX?: boolean;

  /** Constrain the marker position to min/max values of the Y axis during drag operations. */
  constrainY?: boolean;

  /** When set to `true`, it is equivalent to setting `constrainX` and `constrainY` to true. */
  constrain?: boolean;

  /** Name of the legend to be used. Default is `legend`. */
  legend?: string;

  /** Action to perform on legend item click. Default is `auto`. */
  legendAction?: string;

  /** Tooltip configuration. For more info see Tooltips. */
  tooltip?: StringProp | StructuredProp;

  /** Set to true to hide the marker. The marker will still participate in axis range calculations. */
  hidden?: boolean;

  /** Indicate that markers should be stacked horizontally. Default value is `false`. */
  stackedX?: BooleanProp;

  /** Indicate that markers should be stacked vertically. Default value is `false`. */
  stackedY?: BooleanProp;

  /** Name of the stack. If multiple stacks are used, each should have a unique name. Default value is `stack`. */
  stack?: StringProp;

  /**
   * Applies to rectangular shapes. The horizontal corner radius of the rect. Defaults to ry if ry is specified.
   * Value type: <length>|<percentage>;
   * If unit is not specified, it defaults to `px`.
   */
  rx?: StringProp | NumberProp;

  /**
   * Applies to rectangular shapes. The vertical corner radius of the rect. Defaults to rx if rx is specified.
   * Value type: <length>|<percentage>;
   * If unit is not specified, it defaults to `px`.
   */
  ry?: StringProp | NumberProp;

  /** Selection configuration. */
  selection?: any;

  /** Click event handler. */
  onClick?: (e: React.MouseEvent, instance: Instance) => void;
}

export interface MarkerInstance
  extends BoundedObjectInstance,
    TooltipParentInstance {
  axes: Record<string, any>;
  xAxis: any;
  yAxis: any;
  colorMap: any;
}

export class Marker extends BoundedObject {
  declare baseClass: string;
  declare xAxis: string;
  declare yAxis: string;
  declare xOffset: number;
  declare yOffset: number;
  declare size: number;
  declare draggableX: boolean;
  declare draggableY: boolean;
  declare draggable: boolean;
  declare constrainX: boolean;
  declare constrainY: boolean;
  declare constrain: boolean;
  declare legend: string;
  declare legendAction: string;
  declare shape: string;
  declare hidden: boolean;
  declare affectsAxes: boolean;
  declare stackedY: boolean;
  declare stackedX: boolean;
  declare stack: string;
  declare selection: Selection;
  declare tooltip: TooltipConfig;
  declare onClick: MarkerConfig["onClick"];

  constructor(config: MarkerConfig) {
    super(config);
  }

  init(): void {
    this.selection = Selection.create(this.selection);

    if (this.draggable) {
      this.draggableX = true;
      this.draggableY = true;
    }

    if (this.constrain) {
      this.constrainX = true;
      this.constrainY = true;
    }

    super.init();
  }

  declareData(...args: any[]): void {
    var selection = this.selection.configureWidget(this);

    super.declareData(...args, selection, {
      x: undefined,
      y: undefined,
      size: undefined,
      shape: undefined,
      disabled: undefined,
      colorMap: undefined,
      colorIndex: undefined,
      colorName: undefined,
      legendColorIndex: undefined,
      name: undefined,
      active: true,
      stack: undefined,
      stackedX: undefined,
      stackedY: undefined,
      rx: undefined,
      ry: undefined,
    });
  }

  prepareData(context: RenderingContext, instance: MarkerInstance): void {
    instance.axes = context.axes;
    instance.xAxis = context.axes[this.xAxis];
    instance.yAxis = context.axes[this.yAxis];
    let { data } = instance;
    data.selected = this.selection.isInstanceSelected(instance);
    data.stateMods = {
      selected: data.selected,
      disabled: data.disabled,
      selectable: !this.selection.isDummy,
      "draggable-x": this.draggableX && !this.draggableY,
      "draggable-y": this.draggableY && !this.draggableX,
      "draggable-xy": this.draggableY && this.draggableX,
    };
    if (data.name && !data.colorName) data.colorName = data.name;
    super.prepareData(context, instance);
  }

  calculateBounds(context: RenderingContext, instance: MarkerInstance): Rect {
    let { data, xAxis, yAxis } = instance;

    let x!: number, y!: number;

    if (data.x == null || data.y == null) {
      let bounds = super.calculateBounds(context, instance);
      x = (bounds.l + bounds.r) / 2;
      y = (bounds.t + bounds.b) / 2;
    }

    if (data.x != null)
      x = data.stackedX
        ? xAxis.stack(data.stack, data.y, data.x)
        : xAxis.map(data.x);

    if (data.y != null)
      y = data.stackedY
        ? yAxis.stack(data.stack, data.x, data.y)
        : yAxis.map(data.y);

    return new Rect({
      l: x - data.size / 2,
      r: x + data.size / 2,
      t: y - data.size / 2,
      b: y + data.size / 2,
    });
  }

  explore(context: RenderingContext, instance: MarkerInstance): void {
    let { data, xAxis, yAxis } = instance;

    instance.colorMap =
      data.colorMap &&
      context.getColorMap &&
      context.getColorMap(data.colorMap);
    if (instance.colorMap && data.colorName)
      instance.colorMap.acknowledge(data.colorName);

    if (data.active) {
      if (this.affectsAxes) {
        if (xAxis && data.x != null) {
          if (data.stackedX) xAxis.stacknowledge(data.stack, data.y, data.x);
          else xAxis.acknowledge(data.x, 0, this.xOffset);
        }

        if (yAxis && data.y != null) {
          if (data.stackedY) yAxis.stacknowledge(data.stack, data.x, data.y);
          else yAxis.acknowledge(data.y, 0, this.yOffset);
        }
      }
      super.explore(context, instance);
    }
  }

  prepare(context: RenderingContext, instance: MarkerInstance): void {
    let { data, xAxis, yAxis, colorMap } = instance;

    if (colorMap && data.colorName) {
      data.colorIndex = colorMap.map(data.colorName);
      if (instance.cache("colorIndex", data.colorIndex))
        instance.markShouldUpdate(context);
    }

    if (data.active) {
      if (xAxis && xAxis.shouldUpdate) instance.markShouldUpdate(context);

      if (yAxis && yAxis.shouldUpdate) instance.markShouldUpdate(context);

      if (context.pointReducer)
        context.pointReducer(data.x, data.y, data.name, data);
    }

    super.prepare(context, instance);

    if (data.name && context.addLegendEntry)
      context.addLegendEntry(this.legend, {
        name: data.name,
        active: data.active,
        colorIndex: data.legendColorIndex || data.colorIndex,
        disabled: data.disabled,
        selected: data.selected,
        style: data.style,
        shape: data.shape,
        onClick: (e: MouseEvent) => {
          this.onLegendClick(e, instance);
        },
      });
  }

  onLegendClick(e: MouseEvent, instance: MarkerInstance): void {
    let allActions = this.legendAction == "auto";
    let { data } = instance;
    if (allActions || this.legendAction == "toggle")
      if (instance.set("active", !data.active)) return;

    if (allActions || this.legendAction == "select")
      this.handleClick(e as unknown as React.MouseEvent, instance);
  }

  render(
    context: RenderingContext,
    instance: MarkerInstance,
    key: string,
  ): React.ReactNode {
    let { data } = instance;

    if (!data.active || data.x === null || data.y === null) return null;

    return (
      <MarkerComponent
        key={key}
        instance={instance}
        data={instance.data}
        shouldUpdate={instance.shouldUpdate}
      >
        {this.renderChildren(context, instance)}
      </MarkerComponent>
    );
  }

  handleMouseDown(
    e: React.MouseEvent | React.TouchEvent,
    instance: MarkerInstance,
  ): void {
    if (this.draggableX || this.draggableY) {
      let svgEl = closest(e.target as Element, (el) => el.tagName == "svg");
      if (svgEl)
        captureMouseOrTouch(
          e,
          (e, captureData) => {
            this.handleDragMove(e, instance, captureData);
          },
          undefined,
          { svgEl, el: e.target },
          (e.target as HTMLElement).style.cursor,
        );
    } else {
      if (!this.selection.isDummy) this.selection.selectInstance(instance);
    }
  }

  handleClick(e: React.MouseEvent, instance: MarkerInstance): void {
    if (this.onClick) instance.invoke("onClick", e, instance);
  }

  handleDragMove(
    e: MouseEvent | TouchEvent,
    instance: MarkerInstance,
    captureData: any,
  ): void {
    let cursor = getCursorPos(e);
    let svgBounds = getTopLevelBoundingClientRect(captureData.svgEl);
    let { xAxis, yAxis } = instance;
    if (this.draggableX && xAxis) {
      let x = xAxis.trackValue(cursor.clientX - svgBounds.left, this.xOffset);
      if (this.constrainX) x = xAxis.constrainValue(x);
      instance.set("x", xAxis.encodeValue(x));
    }
    if (this.draggableY && yAxis) {
      let y = yAxis.trackValue(cursor.clientY - svgBounds.top, this.yOffset);
      if (this.constrainY) y = yAxis.constrainValue(y);
      instance.set("y", yAxis.encodeValue(y));
    }
    tooltipMouseMove(e, instance, this.tooltip, { target: captureData.el });
  }
}

Marker.prototype.xOffset = 0;
Marker.prototype.yOffset = 0;
Marker.prototype.size = 5;
Marker.prototype.anchors = "0.5 0.5 0.5 0.5";

Marker.prototype.xAxis = "x";
Marker.prototype.yAxis = "y";

Marker.prototype.baseClass = "marker";
Marker.prototype.draggableX = false;
Marker.prototype.draggableY = false;
Marker.prototype.draggable = false;
Marker.prototype.constrainX = false;
Marker.prototype.constrainY = false;
Marker.prototype.constrain = false;
Marker.prototype.legend = "legend";
Marker.prototype.legendAction = "auto";
Marker.prototype.shape = "circle";
Marker.prototype.styled = true;
Marker.prototype.hidden = false;
Marker.prototype.affectsAxes = true;
Marker.prototype.stackedY = false;
Marker.prototype.stackedX = false;
Marker.prototype.stack = "stack";

BoundedObject.alias("marker", Marker);

interface MarkerComponentProps {
  instance: MarkerInstance;
  data: any;
  shouldUpdate?: boolean;
  children?: React.ReactNode;
}

class MarkerComponent extends VDOM.Component<MarkerComponentProps> {
  declare el: SVGElement | null;

  shouldComponentUpdate(props: MarkerComponentProps): boolean {
    return props.shouldUpdate ?? true;
  }

  render(): React.ReactNode {
    let { instance, children, data } = this.props;
    let widget = instance.widget as Marker;
    let { CSS, baseClass } = widget;
    let { bounds, shape } = data;
    let shapeRenderer = getShape(shape);
    let shapeProps: Record<string, any> = {
      className: CSS.element(baseClass, "shape", {
        ["color-" + data.colorIndex]: data.colorIndex != null,
        selected: data.selected,
      }),
      style: data.style,
      cx: (bounds.l + bounds.r) / 2,
      cy: (bounds.t + bounds.b) / 2,
      r: data.size / 2,
      onMouseMove: (e: React.MouseEvent) => {
        tooltipMouseMove(e, instance, widget.tooltip);
      },
      onMouseLeave: (e: React.MouseEvent) => {
        tooltipMouseLeave(e, instance, widget.tooltip);
      },
      onMouseDown: (e: React.MouseEvent) => {
        widget.handleMouseDown(e, instance);
      },
      onTouchStart: (e: React.TouchEvent) => {
        widget.handleMouseDown(e, instance);
      },
      onClick: (e: React.MouseEvent) => {
        widget.handleClick(e, instance);
      },
    };

    if (
      shape == "rect" ||
      shape == "square" ||
      shape == "bar" ||
      shape == "column"
    ) {
      shapeProps.rx = data.rx;
      shapeProps.ry = data.ry;
    }

    if (widget.tooltip) {
      shapeProps.ref = (c: SVGElement | null) => {
        this.el = c;
      };
    }

    return (
      <g className={data.classNames}>
        {!widget.hidden &&
          shapeRenderer(
            (bounds.l + bounds.r) / 2,
            (bounds.t + bounds.b) / 2,
            data.size,
            shapeProps,
          )}
        {children}
      </g>
    );
  }

  componentWillUnmount(): void {
    tooltipParentWillUnmount(this.props.instance);
  }

  UNSAFE_componentWillReceiveProps(props: MarkerComponentProps): void {
    let widget = props.instance.widget as Marker;
    tooltipParentWillReceiveProps(this.el!, props.instance, widget.tooltip);
  }

  componentDidMount(): void {
    let widget = this.props.instance.widget as Marker;
    tooltipParentDidMount(this.el!, this.props.instance, widget.tooltip);
  }

  componentDidUpdate(): void {
    let widget = this.props.instance.widget as Marker;
    tooltipParentDidUpdate(this.el!, this.props.instance, widget.tooltip);
  }
}
