import {Widget, VDOM} from '../ui/Widget';
import {TextualBoundedObject} from './TextualBoundedObject';

export class Line extends TextualBoundedObject {

   declareData() {
      super.declareData(...arguments, {
         colorIndex: undefined,
         stroke: undefined
      })
   }

   render(context, instance, key) {
      var {data, colorIndex} = instance;
      var {bounds} = data;
      return <g key={key} className={data.classNames}>
         <line className={this.CSS.element(this.baseClass, 'line', colorIndex!=null && 'color-'+colorIndex)}
               x1={bounds.l}
               y1={bounds.t}
               x2={bounds.r}
               y2={bounds.b}
               style={data.style}
               stroke={data.stroke}
         />
         {this.renderChildren(context, instance)}
      </g>;
   }
}

Line.prototype.anchors = '0 1 1 0';
Line.prototype.baseClass = 'line';

Widget.alias('line', Line);