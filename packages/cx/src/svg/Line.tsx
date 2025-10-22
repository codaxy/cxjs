/** @jsxImportSource react */
import * as Cx from "../core";
import { Instance } from "../ui/Instance";
import { RenderingContext } from "../ui/RenderingContext";
import { Widget } from "../ui/Widget";
import { TextualBoundedObject, TextualBoundedObjectProps } from "./TextualBoundedObject";

export interface LineProps extends TextualBoundedObjectProps {
   /**
    * Index of the color in the default color palette. Setting this property will set
    * both fill and stroke on the object. Use `style` or a CSS class to remove stroke or fill
    * if they are not necessary.
    */
   colorIndex?: Cx.NumberProp;

   /** A color used to paint the outline of the box. */
   stroke?: Cx.StringProp;

   /** Base CSS class to be applied to the element. Defaults to `line`. */
   baseClass?: string;
}

export class Line extends TextualBoundedObject {
   declare colorIndex?: Cx.NumberProp;
   declare stroke?: Cx.StringProp;

   declareData(...args: any[]) {
      super.declareData(...args, {
         colorIndex: undefined,
         stroke: undefined,
      });
   }

   render(context: RenderingContext, instance: Instance & { colorIndex: number }, key: string) {
      const { data, colorIndex } = instance;
      const { bounds } = data;
      return (
         <g key={key} className={data.classNames}>
            <line
               className={this.CSS.element(this.baseClass, "line", colorIndex != null && "color-" + colorIndex)}
               x1={bounds.l}
               y1={bounds.t}
               x2={bounds.r}
               y2={bounds.b}
               style={data.style}
               stroke={data.stroke}
            />
            {this.renderChildren(context, instance)}
         </g>
      );
   }
}

Line.prototype.anchors = "0 1 1 0";
Line.prototype.baseClass = "line";

Widget.alias("line", Line);
