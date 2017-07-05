import {Widget, VDOM} from '../ui/Widget';
import {BoundedObject} from '../svg/BoundedObject';
import {Rect} from '../svg/util/Rect';
import {tooltipMouseMove, tooltipMouseLeave} from '../widgets/overlay/tooltip-ops';
import {captureMouseOrTouch, getCursorPos} from '../widgets/overlay/captureMouse';
import {closest} from '../util/DOM';
import {Selection} from '../ui/selection/Selection';
import {getShape} from './shapes';

export class Marker extends BoundedObject {

   init() {
      this.selection = Selection.create(this.selection);

      if (this.draggable) {
         this.draggableX = true;
         this.draggableY = true;
      }

      if (this.constrain) {
         this.constrainX = true;
         this.constrainY = true;
      }

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

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.name)
         instance.colorMap.acknowledge(data.name);

      if (data.active) {
         if (xAxis && data.x != null)
            xAxis.acknowledge(data.x, 0, this.xOffset);

         if (yAxis && data.y != null)
            yAxis.acknowledge(data.y, 0, this.yOffset);

         super.explore(context, instance);
      }
   }

   prepare(context, instance) {
      var {data, xAxis, yAxis, colorMap} = instance;

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.name);
         if (instance.cached.colorIndex != data.colorIndex)
            instance.shouldUpdate = true;
      }

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
            onClick: e => {
               this.onLegendClick(e, instance)
            }
         });
   }

   cleanup(context, instance) {
      super.cleanup(context, instance);
      if (instance.colorMap)
         instance.cached.colorIndex = instance.data.colorIndex;
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
      return (
         <MarkerComponent
            key={key}
            instance={instance}
            data={instance.data}
            shouldUpdate={instance.shouldUpdate}
         >
            {this.renderChildren(context, instance)}
         </MarkerComponent>
      )
   }

   handleMouseDown(e, instance) {
      if (this.draggableX || this.draggableY) {
         var svgEl = closest(e.target, el => el.tagName == 'svg');
         if (svgEl)
            captureMouseOrTouch(e, (e, captureData) => {
               this.handleDragMove(e, instance, captureData);
            }, null, {svgEl, el: e.target}, e.target.style.cursor);
      } else {
         if (!this.selection.isDummy)
            this.selection.selectInstance(instance);
      }
   }

   handleClick(e, instance) {
      if (this.onClick)
         instance.invoke("onClick", e, instance);
   }

   handleDragMove(e, instance, captureData) {
      var cursor = getCursorPos(e);
      var svgBounds = captureData.svgEl.getBoundingClientRect();
      var {xAxis, yAxis} = instance;
      if (this.draggableX && xAxis) {
         var x = xAxis.trackValue(cursor.clientX - svgBounds.left, this.xOffset);
         if (this.constrainX)
            x = xAxis.constrainValue(x);
         instance.set('x', xAxis.encodeValue(x));
      }
      if (this.draggableY && yAxis) {
         var y = yAxis.trackValue(cursor.clientY - svgBounds.top, this.yOffset);
         if (this.constrainY)
            y = yAxis.constrainValue(y);
         instance.set('y', yAxis.encodeValue(y));
      }
      tooltipMouseMove(e, instance, this.tooltip, { target: captureData.el });
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
Marker.prototype.draggable = false;
Marker.prototype.constrainX = false;
Marker.prototype.constrainY = false;
Marker.prototype.constrain = false;
Marker.prototype.pure = false;
Marker.prototype.legend = 'legend';
Marker.prototype.legendAction = 'auto';
Marker.prototype.shape = 'circle';

BoundedObject.alias('marker', Marker);

class MarkerComponent extends VDOM.Component {
   shouldComponentUpdate(props) {
      return props.shouldUpdate;
   }

   render() {
      var {instance, children, data} = this.props;
      let {widget} = instance;
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
         onMouseMove: e=> {
            tooltipMouseMove(e, instance, widget.tooltip)
         },
         onMouseLeave: e=> {
            tooltipMouseLeave(e, instance, widget.tooltip)
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
