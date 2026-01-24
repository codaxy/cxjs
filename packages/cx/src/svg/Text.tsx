/** @jsxImportSource react */
import { Widget, VDOM } from "../ui/Widget";
import { BoundedObject, BoundedObjectConfig } from "./BoundedObject";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import { Prop, StringProp } from "../ui/Prop";

export interface TextConfig extends BoundedObjectConfig {
  /** Text to be displayed. */
  value?: StringProp;

  bind?: string;
  tpl?: string;
  expr?: string;

  /** Offset along the x-axis. */
  dx?: Prop<string | number>;

  /**
   * Offset along the y-axis. This property is commonly used for vertical text alignment.
   * Set dy="0.8em" to align the text with the top and dy="0.4em" to center it vertically.
   */
  dy?: Prop<string | number>;

  /** Used for horizontal text alignment. */
  textAnchor?: Prop<"start" | "middle" | "end">;

  /** Shorthand for textAnchor. */
  ta?: Prop<"start" | "middle" | "end">;

  /** Used for vertical text alignment. */
  dominantBaseline?: Prop<
    | "auto"
    | "text-bottom"
    | "alphabetic"
    | "ideographic"
    | "middle"
    | "central"
    | "mathematical"
    | "hanging"
    | "text-top"
  >;

  /** Shorthand for dominantBaseline. */
  db?: Prop<
    | "auto"
    | "text-bottom"
    | "alphabetic"
    | "ideographic"
    | "middle"
    | "central"
    | "mathematical"
    | "hanging"
    | "text-top"
  >;

  /** Sets text-body color. */
  fill?: StringProp;

  /** Sets text-outline color. */
  stroke?: StringProp;

  /** Base CSS class to be applied to the element. Defaults to `text`. */
  baseClass?: string;

  /** Set to true for the text to set the text anchor based on the direction of the parent element. See PieLabels example.  */
  autoTextAnchor?: boolean;
}

export class Text extends BoundedObject<TextConfig> {
  constructor(config?: TextConfig) {
    super(config);
  }

  declare value?: StringProp;
  declare bind?: string;
  declare tpl?: string;
  declare expr?: string;
  declare dx?: Prop<string | number>;
  declare dy?: Prop<string | number>;
  declare textAnchor?: Prop<"start" | "middle" | "end">;
  declare ta?: Prop<"start" | "middle" | "end">;
  declare dominantBaseline?: Prop<
    | "auto"
    | "text-bottom"
    | "alphabetic"
    | "ideographic"
    | "middle"
    | "central"
    | "mathematical"
    | "hanging"
    | "text-top"
  >;
  declare db?: Prop<
    | "auto"
    | "text-bottom"
    | "alphabetic"
    | "ideographic"
    | "middle"
    | "central"
    | "mathematical"
    | "hanging"
    | "text-top"
  >;
  declare fill?: StringProp;
  declare stroke?: StringProp;
  declare autoTextAnchor?: boolean;

  declareData(...args: any[]) {
    return super.declareData(...args, {
      value: undefined,
      dx: undefined,
      dy: undefined,
      textAnchor: undefined,
      dominantBaseline: undefined,
      fill: undefined,
      stroke: undefined,
    });
  }

  init() {
    if (this.ta) this.textAnchor = this.ta;
    if (this.db) this.dominantBaseline = this.db;

    if (this.bind) {
      this.value = {
        bind: this.bind,
      } as any;
    } else if (this.tpl) {
      this.value = {
        tpl: this.tpl,
      } as any;
    } else if (this.expr) {
      this.value = {
        expr: this.expr,
      } as any;
    }

    super.init();
  }

  prepare(context: RenderingContext, instance: Instance) {
    if (this.autoTextAnchor) {
      (instance as any).textAnchor =
        context.textDirection == "right"
          ? "start"
          : context.textDirection == "left"
            ? "end"
            : this.textAnchor;
      let changed = instance.cache("textAnchor", (instance as any).textAnchor);
      if (changed) (instance as any).markShouldUpdate(context);
    }

    super.prepare(context, instance);
  }

  render(context: RenderingContext, instance: Instance, key: string) {
    const { data } = instance;
    const { bounds } = data;

    let textAnchor = this.autoTextAnchor
      ? (instance as any).textAnchor
      : data.textAnchor;

    return (
      <text
        key={key}
        className={data.classNames}
        x={this.autoTextAnchor && textAnchor == "end" ? bounds.r : bounds.l}
        y={bounds.t}
        dx={data.dx}
        dy={data.dy}
        textAnchor={textAnchor}
        dominantBaseline={data.dominantBaseline}
        style={data.style}
        fill={data.fill}
        stroke={data.stroke}
      >
        {data.value}
        {this.renderChildren(context, instance)}
      </text>
    );
  }
}

Text.prototype.anchors = "0.5 0.5 0.5 0.5";
Text.prototype.baseClass = "text";
Text.prototype.autoTextAnchor = false;

Widget.alias("svg.text", Text);
