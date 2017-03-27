import {Widget, VDOM} from '../ui/Widget';
import {TextualBoundedObject} from './TextualBoundedObject';

export class Ellipse extends TextualBoundedObject {

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
         <ellipse className={this.CSS.element(this.baseClass, 'rect', colorIndex!=null && 'color-'+colorIndex)}
                  cx={(bounds.l+bounds.r)/2}
                  cy={(bounds.t+bounds.b)/2}
                  rx={bounds.width()/2}
                  ry={bounds.height()/2}
                  style={data.style}
                  fill={data.fill}
                  stroke={data.stroke}
         />
         {this.renderChildren(context, instance, key)}
      </g>;
   }
}

Ellipse.prototype.baseClass = 'ellipse';
Ellipse.prototype.anchors = '0 1 1 0';

Widget.alias('ellipse', Ellipse);