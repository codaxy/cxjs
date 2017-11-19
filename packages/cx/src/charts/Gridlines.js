import {BoundedObject} from '../svg/BoundedObject';
import {VDOM} from '../ui/Widget';

export class Gridlines extends BoundedObject {

   explore(context, instance) {
      super.explore(context, instance);
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      let {xAxis, yAxis} = instance;
      if ((xAxis && xAxis.shouldUpdate) || (yAxis && yAxis.shouldUpdate))
         instance.markShouldUpdate(context);
   }

   render(context, instance, key) {
      let {data, xAxis, yAxis} = instance;
      let {bounds} = data;
      let path = '', xTicks, yTicks;

      if (xAxis) {
         xTicks = xAxis.mapGridlines();
         xTicks.forEach(x => {
            path += `M ${x} ${bounds.t} L ${x} ${bounds.b}`;
         });
      }

      if (yAxis) {
         yTicks = yAxis.mapGridlines();
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