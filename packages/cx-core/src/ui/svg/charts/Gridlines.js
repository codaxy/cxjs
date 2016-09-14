import {BoundedObject} from '../BoundedObject';
import {VDOM} from '../../Widget';

export class Gridlines extends BoundedObject {

   explore(context, instance) {
      super.explore(context, instance);
      var xAxis = instance.xAxis = context.axes[this.xAxis];
      var yAxis = instance.yAxis = context.axes[this.yAxis];
      if (xAxis && xAxis.shouldUpdate)
         instance.shouldUpdate = true;
      if (yAxis && yAxis.shouldUpdate)
         instance.shouldUpdate = true;
   }

   render(context, instance, key) {
      var {data, xAxis, yAxis} = instance;
      var {bounds} = data;

      var path = '';

      if (xAxis) {
         var xTicks = xAxis.mapGridlines();
         xTicks.forEach(x=> {
            path += `M ${x} ${bounds.t} L ${x} ${bounds.b}`;
         });
      }

      if (yAxis) {
         var yTicks = yAxis.mapGridlines();
         yTicks.forEach(y => {
            path += `M ${bounds.l} ${y} L ${bounds.r} ${y}`;
         });
      }

      return <g key={key} className={data.classNames}>
         <path style={data.style} d={path}/>
      </g>
   }
}

Gridlines.prototype.xAxis = 'x';
Gridlines.prototype.yAxis = 'y';
Gridlines.prototype.anchors = '0 1 1 0';
Gridlines.prototype.baseClass = 'gridlines';

BoundedObject.alias('gridlines', Gridlines);