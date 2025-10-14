/** @jsxImportSource react */
import { Widget, VDOM } from "../ui/Widget";
import { BoundedObject, BoundedObjectProps } from "./BoundedObject";
import { RenderingContext } from "../ui/RenderingContext";
import { Instance } from "../ui/Instance";
import * as Cx from "../core";

export interface TextProps extends BoundedObjectProps {
   /** Text to be displayed. */
   value?: Cx.StringProp;

   bind?: string;
   tpl?: string;
   expr?: string;

   /** Offset along the x-axis. */
   dx?: Cx.Prop<string | number>;

   /**
    * Offset along the y-axis. This property is commonly used for vertical text alignment.
    * Set dy="0.8em" to align the text with the top and dy="0.4em" to center it vertically.
    */
   dy?: Cx.Prop<string | number>;

   /** Used for horizontal text alignment. Accepted values are `start`, `middle` and `end`. */
   textAnchor?: Cx.StringProp;

   /** Used for horizontal text alignment. Accepted values are `start`, `middle` and `end`. */
   ta?: Cx.StringProp;

   /** Sets text-body color. */
   fill?: Cx.StringProp;

   /** Sets text-outline color. */
   stroke?: Cx.StringProp;

   /** Base CSS class to be applied to the element. Defaults to `text`. */
   baseClass?: string;

   /** Set to true for the text to set the text anchor based on the direction of the parent element. See PieLabels example.  */
   autoTextAnchor?: boolean;
}

export class Text extends BoundedObject {
   declare value?: Cx.StringProp;
   declare bind?: string;
   declare tpl?: string;
   declare expr?: string;
   declare dx?: Cx.Prop<string | number>;
   declare dy?: Cx.Prop<string | number>;
   declare textAnchor?: Cx.StringProp;
   declare ta?: Cx.StringProp;
   declare fill?: Cx.StringProp;
   declare stroke?: Cx.StringProp;
   declare autoTextAnchor?: boolean;

   declareData(...args: any[]) {
      return super.declareData(...args, {
         value: undefined,
         dx: undefined,
         dy: undefined,
         textAnchor: undefined,
         fill: undefined,
         stroke: undefined,
      });
   }

   init() {
      if (this.ta) this.textAnchor = this.ta;

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
            context.textDirection == "right" ? "start" : context.textDirection == "left" ? "end" : this.textAnchor;
         let changed = instance.cache("textAnchor", (instance as any).textAnchor);
         if (changed) (instance as any).markShouldUpdate(context);
      }

      super.prepare(context, instance);
   }

   render(context: RenderingContext, instance: Instance, key: string) {
      const { data } = instance;
      const { bounds } = data;

      let textAnchor = this.autoTextAnchor ? (instance as any).textAnchor : data.textAnchor;

      return (
         <text
            key={key}
            className={data.classNames}
            x={this.autoTextAnchor && textAnchor == "end" ? bounds.r : bounds.l}
            y={bounds.t}
            dx={data.dx}
            dy={data.dy}
            textAnchor={textAnchor}
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
(Text.prototype as any).autoAnchor = false;

Widget.alias("svg.text", Text);
