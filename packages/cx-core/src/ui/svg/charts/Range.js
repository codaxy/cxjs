import {BoundedObject} from '../BoundedObject';
import {VDOM} from '../../Widget';

export class Range extends BoundedObject {
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
         if (xAxis) {
            if (xAxis.shouldUpdate)
               instance.shouldUpdate = true;

            if (data.x1 != null)
               instance.xAxis.acknowledge(data.x1, this.xSize, this.xOffset);

            if (data.x2 != null)
               instance.xAxis.acknowledge(data.x2, this.xSize, this.xOffset);
         }

         if (yAxis) {

            if (yAxis.shouldUpdate)
               instance.shouldUpdate = true;

            if (data.y1 != null)
               instance.yAxis.acknowledge(data.y1, this.ySize, this.yOffset);

            if (data.y2 != null)
               instance.yAxis.acknowledge(data.y2, this.ySize, this.yOffset);
         }

         super.explore(context, instance);
      }
   }

   prepare(context, instance) {
      var {data} = instance;
      if (data.active) {
         super.prepare(context, instance);
      }

      if (data.name && data.legend && context.addLegendEntry)
         context.addLegendEntry(data.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            style: data.style,
            shape: 'rect',
            onClick: e=> { this.onLegendClick(e, instance) }
         });
   }

   cleanup(context, instance) {
      var {data} = instance;
      if (data.active) {
         super.cleanup(context, instance);
      }
   }

   onLegendClick(e, instance) {
      var allActions = this.legendAction == 'auto';
      var {data} = instance;
      if (allActions || this.legendAction == 'toggle')
         instance.set('active', !data.active);
   }

   calculateBounds(context, instance) {
      var bounds = super.calculateBounds(context, instance);
      var {data, xAxis, yAxis} = instance;

      if (data.x1 != null)
         bounds.l = xAxis.map(data.x1, this.xOffset - this.xSize / 2);

      if (data.x2 != null)
         bounds.r = xAxis.map(data.x2,this.xOffset + this.xSize / 2);

      if (data.y1 != null)
         bounds.t = yAxis.map(data.y1, this.yOffset - this.ySize / 2);

      if (data.y2 != null)
         bounds.b = yAxis.map(data.y2, this.yOffset + this.ySize / 2);

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
         {
            !this.hidden && <rect className={this.CSS.element(this.baseClass, 'rect', stateMods)}
                                  style={data.style}
                                  x={x1}
                                  y={y1}
                                  width={x2 - x1}
                                  height={y2 - y1}/>
         }
         {this.renderChildren(context, instance)}
      </g>
   }
}

Range.prototype.invisible = false;
Range.prototype.xAxis = 'x';
Range.prototype.yAxis = 'y';
Range.prototype.xSize = 0;
Range.prototype.ySize = 0;
Range.prototype.xOffset = 0;
Range.prototype.yOffset = 0;
Range.prototype.anchors = '0 1 1 0';
Range.prototype.baseClass = 'range';
Range.prototype.legend = 'legend';
Range.prototype.legendAction = 'auto';

BoundedObject.alias('range', Range);