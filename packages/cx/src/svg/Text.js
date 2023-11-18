import { Widget, VDOM } from "../ui/Widget";
import { BoundedObject } from "./BoundedObject";

export class Text extends BoundedObject {
   declareData() {
      return super.declareData(...arguments, {
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
         };
      } else if (this.tpl) {
         this.value = {
            tpl: this.tpl,
         };
      } else if (this.expr) {
         this.value = {
            expr: this.expr,
         };
      }

      super.init();
   }

   prepare(context, instance) {
      if (this.autoTextAnchor) {
         instance.textAnchor =
            context.textDirection == "right" ? "start" : context.textDirection == "left" ? "end" : this.textAnchor;
         let changed = instance.cache("textAnchor", instance.textAnchor);
         if (changed) instance.markShouldUpdate(context);
      }

      super.prepare(context, instance);
   }

   render(context, instance, key) {
      var { data } = instance;
      var { bounds } = data;

      let textAnchor = this.autoTextAnchor ? instance.textAnchor : data.textAnchor;

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
Text.prototype.autoAnchor = false;

Widget.alias("svg.text", Text);
