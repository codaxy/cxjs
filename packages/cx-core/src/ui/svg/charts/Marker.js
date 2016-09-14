import {Widget, VDOM} from '../../Widget';
import {BoundedObject} from '../BoundedObject';
import {Rect} from '../util/Rect';
import {tooltipMouseEnter, tooltipMouseLeave} from '../../overlay/Tooltip';
import {captureMouseOrTouch} from '../../overlay/captureMouse';
import {closest} from '../../../util/DOM';
import {Selection} from '../../selection/Selection';
import {getShape} from './shapes';

export class Marker extends BoundedObject {

   init() {
      this.selection = Selection.create(this.selection);
      super.init();
   }

   declareData() {
      return super.declareData(...arguments, {
         x: undefined,
         y: undefined,
         size: undefined,
         shape: undefined,
         style: {structured: true},
         class: {structured: true},
         className: {structured: true},
         tooltip: {structured: true},
         disabled: undefined,
         colorIndex: undefined,
         legendColorIndex: undefined,
         name: undefined,
         active: true
      });
   }

   prepareData(context, instance) {
      instance.axes = context.axes;
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      var {data} = instance;
      data.selected = this.selection.isInstanceSelected(instance);
      data.stateMods = {
         selected: data.selected,
         disabled: data.disabled,
         selectable: !this.selection.isDummy,
         "draggable-x": this.draggableX && !this.draggableY,
         "draggable-y": this.draggableY && !this.draggableX,
         "draggable-xy": this.draggableY && this.draggableX
      };
      super.prepareData(context, instance);
   }

   calculateBounds(context, instance) {
      var {data, xAxis, yAxis} = instance;

      var x, y;

      if (data.x == null || data.y == null) {
         var bounds = super.calculateBounds(context, instance);
         x = (bounds.l + bounds.r) / 2;
         y = (bounds.t + bounds.b) / 2;
      }

      if (data.x != null)
         x = xAxis.map(data.x);

      if (data.y != null)
         y = yAxis.map(data.y);

      return new Rect({
         l: x - data.size / 2,
         r: x + data.size / 2,
         t: y - data.size / 2,
         b: y + data.size / 2
      });
   }

   explore(context, instance) {
      let {data, xAxis, yAxis} = instance;
      if (data.active) {
         if (xAxis && data.x != null)
            xAxis.acknowledge(data.x, 0, this.xOffset);

         if (yAxis && data.y != null)
            yAxis.acknowledge(data.y, 0, this.yOffset);

         super.explore(context, instance);
      }
   }

   prepare(context, instance) {
      var {data, xAxis, yAxis} = instance;

      if (data.active) {
         if (xAxis && xAxis.shouldUpdate)
            instance.shouldUpdate = true;

         if (yAxis && yAxis.shouldUpdate)
            instance.shouldUpdate = true;

         super.prepare(context, instance);
      }

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.legendColorIndex || data.colorIndex,
            disabled: data.disabled,
            selected: data.selected,
            style: data.style,
            shape: data.shape,
            onClick: e=> {
               this.onLegendClick(e, instance)
            }
         });
   }

   onLegendClick(e, instance) {
      var allActions = this.legendAction == 'auto';
      var {data} = instance;
      if (allActions || this.legendAction == 'toggle')
         if (instance.set('active', !data.active))
            return;

      if (allActions || this.legendAction == 'select')
         this.handleClick(e, instance)
   }

   render(context, instance, key) {
      return <MarkerComponent key={key} instance={instance}>
         {this.renderChildren(context, instance)}
      </MarkerComponent>
   }

   handleMouseDown(e, instance) {
      if (this.draggableX || this.draggableY) {
         var svgEl = closest(e.target, el => el.tagName == 'svg');
         if (svgEl)
            captureMouseOrTouch(e, (e, captureData) => {
               this.handleDragMove(e, instance, captureData);
            }, null, {svgEl}, e.target.style.cursor);
      } else {
         if (!this.selection.isDummy)
            this.selection.selectInstance(instance);
      }
   }

   handleClick(e, instance) {

   }

   handleDragMove(e, instance, captureData) {
      var cursor = (e.touches && e.touches[0]) || e;
      var svgBounds = captureData.svgEl.getBoundingClientRect();
      if (this.draggableX) {
         var x = instance.xAxis.track(cursor.clientX - svgBounds.left, this.xOffset);
         instance.set('x', x);
      }
      if (this.draggableY) {
         var y = instance.yAxis.track(cursor.clientY - svgBounds.top, this.yOffset);
         instance.set('y', y);
      }
   }
}

Marker.prototype.xOffset = 0;
Marker.prototype.yOffset = 0;
Marker.prototype.size = 5;
Marker.prototype.anchors = '0.5 0.5 0.5 0.5';

Marker.prototype.xAxis = 'x';
Marker.prototype.yAxis = 'y';

Marker.prototype.baseClass = 'marker';
Marker.prototype.draggableX = false;
Marker.prototype.draggableY = false;
Marker.prototype.pure = false;
Marker.prototype.legend = 'legend';
Marker.prototype.legendAction = 'auto';
Marker.prototype.shape = 'circle';

BoundedObject.alias('marker', Marker);

class MarkerComponent extends VDOM.Component {
   shouldComponentUpdate(props) {
      return props.instance.shouldUpdate;
   }

   render() {
      var {instance, children} = this.props;
      let {widget, data} = instance;
      let {CSS, baseClass} = widget;

      if (!data.active)
         return null;

      var {bounds, shape} = data;

      var shapeRenderer = getShape(shape);
      var shapeProps = {
         className: CSS.element(baseClass, 'shape', data.colorIndex != null && 'color-' + data.colorIndex),
         style: data.style,
         cx: (bounds.l + bounds.r) / 2,
         cy: (bounds.t + bounds.b) / 2,
         r: data.size / 2,
         onMouseEnter: e=> {
            tooltipMouseEnter(e, instance)
         },
         onMouseLeave: e=> {
            tooltipMouseLeave(e, instance)
         },
         onMouseDown: e=> {
            widget.handleMouseDown(e, instance)
         },
         onTouchStart: e=> {
            widget.handleMouseDown(e, instance)
         },
         onClick: e=>{
            widget.handleItemClick(e, instance);
         }
      };

      return <g className={data.classNames}>
         {shapeRenderer((bounds.l + bounds.r) / 2, (bounds.t + bounds.b) / 2, data.size, shapeProps)}
         {children}
      </g>;
   }
}
