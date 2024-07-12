import {Widget, VDOM} from '../ui/Widget';
import {TextualBoundedObject} from './TextualBoundedObject';

export class Rectangle extends TextualBoundedObject {
   declareData() {
      super.declareData(...arguments, {
         colorIndex: undefined,
         fill: undefined,
         stroke: undefined,
         rx: undefined,
         ry: undefined,
      })
   }

   render(context, instance, key) {
      var {data} = instance;
      var {bounds, colorIndex} = data;
      if (!bounds.valid())
         return false;
      return <g key={key} className={data.classNames}>
         <rect className={this.CSS.element(this.baseClass, 'rect', colorIndex!=null && 'color-'+colorIndex)}
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
      </g>;
   }
}

Rectangle.prototype.baseClass = 'rectangle';
Rectangle.prototype.anchors = '0 1 1 0';
Rectangle.prototype.rx = undefined;
Rectangle.prototype.ry = undefined;

Widget.alias('rectangle', Rectangle);