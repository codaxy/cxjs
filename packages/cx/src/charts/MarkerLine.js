import {BoundedObject} from '../svg/BoundedObject';
import {VDOM} from '../ui/Widget';
import {isDefined} from '../util/isDefined';
import {Rect} from '../svg/util/Rect';

export class MarkerLine extends BoundedObject {

   init() {
      if (isDefined(this.x))
         this.x1 = this.x2 = this.x;

      if (isDefined(this.y))
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
      let {data} = instance;

      let xAxis = instance.xAxis = context.axes[this.xAxis];
      let yAxis = instance.yAxis = context.axes[this.yAxis];

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
      let {data, xAxis, yAxis} = instance;

      if ((xAxis && xAxis.shouldUpdate) || (yAxis && yAxis.shouldUpdate))
         instance.markShouldUpdate(context);

      super.prepare(context, instance);

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
      let {data, xAxis, yAxis} = instance;
      let bounds = super.calculateBounds(context, instance);

      let x1 = bounds.l, x2 = bounds.r, y1 = bounds.t, y2 = bounds.b;

      if (data.x1 != null)
         x1 = xAxis.map(data.x1);

      if (data.x2 != null)
         x2 = xAxis.map(data.x2);

      if (data.y1 != null)
         y1 = yAxis.map(data.y1);

      if (data.y2 != null)
         y2 = yAxis.map(data.y2);

      bounds.l = Math.min(x1, x2);
      bounds.t = Math.min(y1, y2);
      bounds.r = Math.max(x1, x2);
      bounds.b = Math.max(y1, y2);

      instance.x1 = x1;
      instance.x2 = x2;
      instance.y1 = y1;
      instance.y2 = y2;

      return bounds;
   }

   render(context, instance, key) {
      let {data, x1, x2, y1, y2} = instance;

      if (!data.active || data.x1 === null || data.x2 === null || data.y1 === null || data.y2 === null)
         return null;

      let stateMods = {
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

