/**@jsxImportSource react */
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { Widget } from "../ui/Widget";
import { NumberProp, StringProp } from "../ui/Prop";
import {
  TextualBoundedObject,
  TextualBoundedObjectConfig,
} from "./TextualBoundedObject";

export interface EllipseConfig extends TextualBoundedObjectConfig {
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

  /** Base CSS class to be applied to the element. Defaults to `ellipse`. */
  baseClass?: string;
}

export class Ellipse extends TextualBoundedObject {
  declare baseClass: string;
  declare colorIndex?: NumberProp;
  declare fill?: StringProp;
  declare stroke?: StringProp;

  constructor(config?: EllipseConfig) {
    super(config);
  }

  declareData(...args: any[]) {
    super.declareData(...args, {
      colorIndex: undefined,
      fill: undefined,
      stroke: undefined,
    });
  }

  render(context: RenderingContext, instance: Instance, key: string) {
    const { data } = instance;
    const { bounds, colorIndex } = data;
    if (!bounds.valid()) return false;
    return (
      <g key={key} className={data.classNames}>
        <ellipse
          className={this.CSS.element(
            this.baseClass,
            "rect",
            colorIndex != null && "color-" + colorIndex,
          )}
          cx={(bounds.l + bounds.r) / 2}
          cy={(bounds.t + bounds.b) / 2}
          rx={bounds.width() / 2}
          ry={bounds.height() / 2}
          style={data.style}
          fill={data.fill}
          stroke={data.stroke}
        />
        {this.renderChildren(context, instance)}
      </g>
    );
  }
}

Ellipse.prototype.baseClass = "ellipse";
Ellipse.prototype.anchors = "0 1 1 0";

Widget.alias("ellipse", Ellipse);
