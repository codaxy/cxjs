import {BoundedObject} from '../svg/BoundedObject';
import {VDOM} from '../ui/Widget';
import {captureMouseOrTouch, getCursorPos} from '../widgets/overlay/captureMouse';
import {closest} from '../util/DOM';
import {getTopLevelBoundingClientRect} from "../util/getTopLevelBoundingClientRect";

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
            if (data.x1 != null)
               instance.xAxis.acknowledge(data.x1, this.xSize, this.xOffset);

            if (data.x2 != null)
               instance.xAxis.acknowledge(data.x2, this.xSize, this.xOffset);
         }

         if (yAxis) {
            if (data.y1 != null)
               instance.yAxis.acknowledge(data.y1, this.ySize, this.yOffset);

            if (data.y2 != null)
               instance.yAxis.acknowledge(data.y2, this.ySize, this.yOffset);
         }

         super.explore(context, instance);
      }
   }

   prepare(context, instance) {
      super.prepare(context, instance);

      var {data, xAxis, yAxis} = instance;

      if (xAxis && xAxis.shouldUpdate)
         instance.markShouldUpdate(context);

      if (yAxis && yAxis.shouldUpdate)
         instance.markShouldUpdate(context);

      if (data.name && data.legend && context.addLegendEntry)
         context.addLegendEntry(data.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            style: data.style,
            shape: 'rect',
            onClick: e => {
               this.onLegendClick(e, instance)
            }
         });
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
                                  height={y2 - y1}
                                  onMouseDown={e=>this.handleMouseDown(e, instance)}
                                  onTouchStart={e=>this.handleMouseDown(e, instance)}
            />
         }
         {this.renderChildren(context, instance)}
      </g>
   }

   handleClick(e, instance) {
      if (this.onClick)
         instance.invoke("onClick", e, instance);
   }

   handleMouseDown(e, instance) {
      if (this.draggableX || this.draggableY) {
         var svgEl = closest(e.target, el => el.tagName == 'svg');
         var svgBounds = getTopLevelBoundingClientRect(svgEl);
         var cursor = getCursorPos(e);
         var {data, xAxis, yAxis} = instance;

         var captureData = {
            svgBounds,
            start: {
               x1: data.x1,
               x2: data.x2,
               y1: data.y1,
               y2: data.y2
            }
         };

         if (this.draggableX && xAxis)
            captureData.start.x = xAxis.trackValue(cursor.clientX - svgBounds.left, this.xOffset, this.constrainX);

         if (this.draggableY && yAxis)
            captureData.start.y = yAxis.trackValue(cursor.clientY - svgBounds.top, this.yOffset, this.constrainY);

         if (svgEl)
            captureMouseOrTouch(e, (e, captureData) => {
               this.handleDragMove(e, instance, captureData);
            }, null, captureData, e.target.style.cursor);
      }
   }

   handleDragMove(e, instance, captureData) {
      var cursor = getCursorPos(e);
      var {xAxis, yAxis} = instance;
      var {svgBounds, start} = captureData;
      if (this.draggableX && xAxis) {
         var dist = xAxis.trackValue(cursor.clientX - svgBounds.left, this.xOffset, this.constrainX) - captureData.start.x;
         var x1v = xAxis.decodeValue(captureData.start.x1);
         var x2v = xAxis.decodeValue(captureData.start.x2);
         if (this.constrainX) {
            if (dist > 0)
               dist = Math.min(xAxis.constrainValue(x2v + dist) - x2v, dist);
            else
               dist = Math.max(xAxis.constrainValue(x1v + dist) - x1v, dist);
         }
         instance.set('x1', xAxis.encodeValue(x1v + dist));
         instance.set('x2', xAxis.encodeValue(x2v + dist));
      }

      if (this.draggableY && yAxis) {
         var dist = yAxis.trackValue(cursor.clientY - svgBounds.left, this.yOffset, this.constrainY) - captureData.start.y;
         var y1v = yAxis.decodeValue(captureData.start.y1);
         var y2v = yAxis.decodeValue(captureData.start.y2);
         if (this.constrainY)
            dist = Math.max(yAxis.constrainValue(y1v + dist) - y1v, Math.min(yAxis.constrainValue(y2v + dist) - y2v, dist));
         instance.set('y1', yAxis.encodeValue(y1v + dist));
         instance.set('y2', yAxis.encodeValue(y2v + dist));
      }
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