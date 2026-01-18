/** @jsxImportSource react */
import { Instance } from "../ui/Instance";
import { NumberProp, StringProp } from "../ui/Prop";
import { RenderingContext } from "../ui/RenderingContext";
import { Widget } from "../ui/Widget";
import {
  TextualBoundedObject,
  TextualBoundedObjectConfig,
} from "./TextualBoundedObject";

export interface RectangleConfig extends TextualBoundedObjectConfig {
  /**
   * Index of the color in the default color palette. Setting this property will set
   * both fill and stroke on the object. Use `style` or a CSS class to remove stroke or fill
   * if they are not necessary.
   */
  colorIndex?: NumberProp;

  /** A color used to paint the box. */
  fill?: StringProp;

  /** A color used to paint the outline of the box. */
  stroke?: StringProp;

  /** Base CSS class to be applied to the element. Defaults to `rectangle`. */
  baseClass?: string;

  /**
   * The horizontal corner radius of the rect. Defaults to ry if it is specified.
   * Value type: <length>|<percentage>;
   * If unit is not specified, it defaults to `px`.
   */
  rx?: StringProp | NumberProp;

  /**
   * The vertical corner radius of the rect. Defaults to rx if it is specified.
   * Value type: <length>|<percentage>;
   * If unit is not specified, it defaults to `px`.
   */
  ry?: StringProp | NumberProp;
}

export class Rectangle extends TextualBoundedObject {
  declare baseClass: string;
  declare colorIndex?: NumberProp;
  declare fill?: StringProp;
  declare stroke?: StringProp;
  declare rx?: StringProp | NumberProp;
  declare ry?: StringProp | NumberProp;

  constructor(config?: RectangleConfig) {
    super(config);
  }

  declareData(...args: any[]) {
    super.declareData(...args, {
      colorIndex: undefined,
      fill: undefined,
      stroke: undefined,
      rx: undefined,
      ry: undefined,
    });
  }

  render(context: RenderingContext, instance: Instance, key: string) {
    const { data } = instance;
    const { bounds, colorIndex } = data;
    if (!bounds.valid()) return false;
    return (
      <g key={key} className={data.classNames}>
        <rect
          className={this.CSS.element(
            this.baseClass,
            "rect",
            colorIndex != null && "color-" + colorIndex,
          )}
          x={bounds.l}
          y={bounds.t}
          width={bounds.width()}
          height={bounds.height()}
          style={data.style}
          fill={data.fill}
          stroke={data.stroke}
          rx={data.rx}
          ry={data.ry}
        />
        {this.renderChildren(context, instance)}
      </g>
    );
  }
}

Rectangle.prototype.baseClass = "rectangle";
Rectangle.prototype.anchors = "0 1 1 0";
Rectangle.prototype.rx = undefined;
Rectangle.prototype.ry = undefined;

Widget.alias("rectangle", Rectangle);
