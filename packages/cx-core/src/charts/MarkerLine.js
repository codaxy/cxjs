import {BoundedObject} from '../svg/BoundedObject';
import {VDOM} from '../ui/Widget';

export class MarkerLine extends BoundedObject {

   init() {
      if (typeof this.x != 'undefined')
         this.x1 = this.x2 = this.x;

      if (typeof this.y != 'undefined')
         this.y1 = this.y2 = this.y;

      super.init()
   }

   declareData() {
      super.declareData(...arguments, {
         x1: undefined,
         y1: undefined,
         x2: undefined,
         y2: undefined,
         colorIndex: undefined,
         active: true,
         name: undefined,
         legend: undefined
      })
   }

   explore(context, instance) {
      var {data} = instance;

      var xAxis = instance.xAxis = context.axes[this.xAxis];
      var yAxis = instance.yAxis = context.axes[this.yAxis];

      if (data.active) {

         if (data.x1 != null)
            xAxis.acknowledge(data.x1);

         if (data.x2 != null)
            xAxis.acknowledge(data.x2);

         if (data.y1 != null)
            yAxis.acknowledge(data.y1);

         if (data.y2 != null)
            yAxis.acknowledge(data.y2);

         super.explore(context, instance);
      }
   }

   prepare(context, instance) {
      var {data, xAxis, yAxis} = instance;

      if (data.active)
         super.prepare(context, instance);

      if (xAxis.shouldUpdate || yAxis.shouldUpdate)
         instance.shouldUpdate = true;

      if (data.name && data.legend && context.addLegendEntry)
         context.addLegendEntry(data.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            style: data.style,
            shape: 'line',
            onClick: e=> { this.onLegendClick(e, instance) }
         });
   }

   calculateBounds(context, instance) {
      var {data, xAxis, yAxis} = instance;
      var bounds = super.calculateBounds(context, instance);

      if (data.x1 != null)
         bounds.l = xAxis.map(data.x1);

      if (data.x2 != null)
         bounds.r = xAxis.map(data.x2);

      if (data.y1 != null)
         bounds.t = yAxis.map(data.y1);

      if (data.y2 != null)
         bounds.b = yAxis.map(data.y2);

      return bounds;
   }

   render(context, instance, key) {
      var {data} = instance;

      if (!data.active)
         return null;

      var {bounds} = data;
      var x1 = Math.min(bounds.l, bounds.r),
         y1 = Math.min(bounds.t, bounds.b),
         x2 = Math.max(bounds.l, bounds.r),
         y2 = Math.max(bounds.t, bounds.b);

      var stateMods = {
         ['color-' + data.colorIndex]: data.colorIndex != null
      };

      return <g key={key} className={data.classNames}>
         <line className={this.CSS.element(this.baseClass, 'line', stateMods)} style={data.style} x1={x1} y1={y1} x2={x2} y2={y2} />
         {this.renderChildren(context, instance)}
      </g>
   }
}

MarkerLine.prototype.xAxis = 'x';
MarkerLine.prototype.yAxis = 'y';
MarkerLine.prototype.anchors = '0 1 1 0';
MarkerLine.prototype.baseClass = 'markerline';
MarkerLine.prototype.legend = 'legend';
MarkerLine.prototype.legendAction = 'auto';

BoundedObject.alias('marker-line', MarkerLine);

