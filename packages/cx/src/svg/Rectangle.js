import {Widget, VDOM} from '../ui/Widget';
import {TextualBoundedObject} from './TextualBoundedObject';

export class Rectangle extends TextualBoundedObject {

   declareData() {
      super.declareData(...arguments, {
         colorIndex: undefined,
         fill: undefined,
         stroke: undefined
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
         />
         {this.renderChildren(context, instance, key)}
      </g>;
   }
}

Rectangle.prototype.baseClass = 'rectangle';
Rectangle.prototype.anchors = '0 1 1 0';

Widget.alias('rectangle', Rectangle);