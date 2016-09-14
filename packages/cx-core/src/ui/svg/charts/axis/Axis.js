import {BoundedObject} from '../../BoundedObject'
import {VDOM} from '../../../Widget';

export class Axis extends BoundedObject {

   init() {
      if (this.labelAnchor == 'auto')
         this.labelAnchor = this.vertical ? this.secondary ? 'start' : 'end' : 'middle';

      if (this.labelDx == 'auto')
         this.labelDx = 0;

      if (this.labelDy == 'auto')
         this.labelDy = this.vertical ? '0.4em' : this.secondary ? 0 : '0.8em';

      if (typeof this.minLabelDistance == "undefined")
         this.minLabelDistance = this.vertical ? this.minLabelDistanceVertical : this.minLabelDistanceHorizontal;

      super.init();
   }

   declareData() {
      super.declareData({
         anchors: '0 1 1 0'
      }, ...arguments)
   }

   report(context, instance) {
      return instance.calculator;
   }

   renderTicksAndLabels(context, instance, valueFormatter) {

      if (this.hidden)
         return false;

      var {data, calculator} = instance;
      var {bounds} = data;
      var size = calculator.findTickSize(this.minLabelDistance);

      var labelClass = this.CSS.element(this.baseClass, 'label');

      var x1, y1, x2, y2, tickSize = this.tickSize;

      if (this.vertical) {
         x1 = x2 = this.secondary ? bounds.r : bounds.l;
         y1 = bounds.b;
         y2 = bounds.t;
      } else {
         x1 = bounds.l;
         x2 = bounds.r;
         y1 = y2 = this.secondary ? bounds.t : bounds.b;
      }

      var res = [
         <line key="line"
               className={this.CSS.element(this.baseClass, "line")}
               x1={x1} y1={y1} x2={x2} y2={y2}/>,
         null
      ];
      var t = [];
      if (size > 0) {
         var ticks = calculator.getTicks([size]);
         ticks.forEach((serie, si)=> {
            serie.forEach((v, i)=> {
               var s = calculator.map(v);

               if (this.secondary) {
                  x1 = this.vertical ? bounds.r : s;
                  y1 = this.vertical ? s : bounds.t;
                  x2 = this.vertical ? bounds.r + tickSize : s;
                  y2 = this.vertical ? s : bounds.t - tickSize;
               } else {
                  x1 = this.vertical ? bounds.l : s;
                  y1 = this.vertical ? s : bounds.b;
                  x2 = this.vertical ? bounds.l - tickSize : s;
                  y2 = this.vertical ? s : bounds.b + tickSize;
               }

               t.push(`M ${x1} ${y1} L ${x2} ${y2}`);

               var x, y;
               if (this.secondary) {
                  x = this.vertical ? bounds.r + this.labelOffset : s;
                  y = this.vertical ? s : bounds.t - this.labelOffset;
               } else {
                  x = this.vertical ? bounds.l - this.labelOffset : s;
                  y = this.vertical ? s : bounds.b + this.labelOffset;
               }

               var transform = this.labelRotation ? `rotate(${this.labelRotation} ${x} ${y})` : null;
               res.push(<text key={`label-${si}-${i}`}
                              className={labelClass}
                              x={x}
                              y={y}
                              dx={this.labelDx}
                              dy={this.labelDy}
                              textAnchor={this.labelAnchor}
                              transform={transform}>
                  {valueFormatter(v)}
               </text>);
            });
         });
      }
      res[1] = <path key="ticks" className={this.CSS.element(this.baseClass, "ticks")} d={t.join(' ')}/>;
      return res;
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      var {bounds} = instance.data;
      var [a, b] = !this.vertical ? [bounds.l, bounds.r] : [bounds.b, bounds.t];
      instance.calculator.measure(a, b);
      if (!instance.calculator.isSame(instance.cached.axis))
         instance.shouldUpdate = true;
   }

   cleanup(context, instance) {
      var {cached, calculator} = instance;
      cached.axis = calculator.hash();
      super.cleanup(context, instance);
   }
}

Axis.prototype.anchors = '0 1 1 0';
Axis.prototype.vertical = false;
Axis.prototype.secondary = false;
Axis.prototype.inverted = false;
Axis.prototype.hidden = false;

Axis.prototype.tickSize = 3;
Axis.prototype.minTickDistance = 25;
Axis.prototype.minLabelDistanceVertical = 40;
Axis.prototype.minLabelDistanceHorizontal = 50;
Axis.prototype.labelOffset = 10;
Axis.prototype.labelRotation = 0;
Axis.prototype.labelAnchor = 'auto';
Axis.prototype.labelDx = 'auto';
Axis.prototype.labelDy = 'auto';

Axis.namespace = 'ui.svg.chart.axis';



