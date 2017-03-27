import {Widget, VDOM} from '../ui/Widget';
import {BoundedObject} from './BoundedObject';

export class Text extends BoundedObject {

   declareData() {
      return super.declareData(...arguments, {
         value: undefined,
         dx: undefined,
         dy: undefined,
         textAnchor: undefined,
         fill: undefined,
         stroke: undefined
      })
   }

   init() {

      if (this.ta)
         this.textAnchor = this.ta;

      if (this.bind) {
         this.value = {
            bind: this.bind
         };
      } else if (this.tpl) {
         this.value = {
            tpl: this.tpl
         }
      }
      else if (this.expr) {
         this.value = {
            expr: this.expr
         }
      }

      super.init();
   }

   render(context, instance, key) {
      var {data} = instance;
      var {bounds} = data;
      return <text key={key}
                   className={data.classNames}
                   x={bounds.l}
                   y={bounds.t}
                   dx={data.dx}
                   dy={data.dy}
                   textAnchor={data.textAnchor}
                   style={data.style}
                   fill={data.fill}
                   stroke={data.stroke}>
         {data.value}
         {this.renderChildren(context, instance)}
      </text>
   }
}

Text.prototype.anchors = '0.5 0.5 0.5 0.5';
Text.prototype.baseClass = 'text';

Widget.alias('svg.text', Text);