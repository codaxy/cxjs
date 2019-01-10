import {Widget, VDOM} from '../ui/Widget';
import {BoundedObject} from '../svg/BoundedObject';
import {Rect} from '../svg/util/Rect';
import {tooltipMouseMove, tooltipMouseLeave, tooltipParentWillUnmount, tooltipParentWillReceiveProps, tooltipParentDidMount} from '../widgets/overlay/tooltip-ops';
import {captureMouseOrTouch, getCursorPos} from '../widgets/overlay/captureMouse';
import {closest} from '../util/DOM';
import {Selection} from '../ui/selection/Selection';
import {getShape} from './shapes';
import {getTopLevelBoundingClientRect} from "../util/getTopLevelBoundingClientRect";

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
      var selection = this.selection.configureWidget(this);

      return super.declareData(...arguments, selection, {
         x: undefined,
         y: undefined,
         size: undefined,
         shape: undefined,
         disabled: undefined,
         colorMap: undefined,
         colorIndex: undefined,
         colorName: undefined,
         legendColorIndex: undefined,
         name: undefined,
         active: true
      });
   }

   prepareData(context, instance) {
      instance.axes = context.axes;
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      let {data} = instance;
      data.selected = this.selection.isInstanceSelected(instance);
      data.stateMods = {
         selected: data.selected,
         disabled: data.disabled,
         selectable: !this.selection.isDummy,
         "draggable-x": this.draggableX && !this.draggableY,
         "draggable-y": this.draggableY && !this.draggableX,
         "draggable-xy": this.draggableY && this.draggableX
      };
      if (data.name && !data.colorName)
         data.colorName = data.name;
      super.prepareData(context, instance);
   }

   calculateBounds(context, instance) {
      let {data, xAxis, yAxis} = instance;

      let x, y;

      if (data.x == null || data.y == null) {
         let bounds = super.calculateBounds(context, instance);
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
      if (instance.colorMap && data.colorName)
         instance.colorMap.acknowledge(data.colorName);

      if (data.active) {
         if (xAxis && data.x != null)
            xAxis.acknowledge(data.x, 0, this.xOffset);

         if (yAxis && data.y != null)
            yAxis.acknowledge(data.y, 0, this.yOffset);

         if (context.pointReducer)
            context.pointReducer(data.x, data.y, data.name, data);

         super.explore(context, instance);
      }
   }

   prepare(context, instance) {
      let {data, xAxis, yAxis, colorMap} = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache('colorIndex', data.colorIndex))
            instance.markShouldUpdate(context);
      }

      if (data.active) {
         if (xAxis && xAxis.shouldUpdate)
            instance.markShouldUpdate(context);

         if (yAxis && yAxis.shouldUpdate)
            instance.markShouldUpdate(context);
      }

      super.prepare(context, instance);

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

   onLegendClick(e, instance) {
      let allActions = this.legendAction == 'auto';
      let {data} = instance;
      if (allActions || this.legendAction == 'toggle')
         if (instance.set('active', !data.active))
            return;

      if (allActions || this.legendAction == 'select')
         this.handleClick(e, instance)
   }

   render(context, instance, key) {
      let {data} = instance;

      if (!data.active || data.x === null || data.y === null)
         return null;

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
         let svgEl = closest(e.target, el => el.tagName == 'svg');
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
      let cursor = getCursorPos(e);
      let svgBounds = getTopLevelBoundingClientRect(captureData.svgEl);
      let {xAxis, yAxis} = instance;
      if (this.draggableX && xAxis) {
         let x = xAxis.trackValue(cursor.clientX - svgBounds.left, this.xOffset);
         if (this.constrainX)
            x = xAxis.constrainValue(x);
         instance.set('x', xAxis.encodeValue(x));
      }
      if (this.draggableY && yAxis) {
         let y = yAxis.trackValue(cursor.clientY - svgBounds.top, this.yOffset);
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
Marker.prototype.legend = 'legend';
Marker.prototype.legendAction = 'auto';
Marker.prototype.shape = 'circle';
Marker.prototype.styled = true;
Marker.prototype.hidden = false;

BoundedObject.alias('marker', Marker);

class MarkerComponent extends VDOM.Component {
   shouldComponentUpdate(props) {
      return props.shouldUpdate;
   }

   render() {
      let {instance, children, data} = this.props;
      let {widget} = instance;
      let {CSS, baseClass} = widget;
      let {bounds, shape} = data;
      let shapeRenderer = getShape(shape);
      let shapeProps = {
         className: CSS.element(baseClass, 'shape', {
            ['color-' + data.colorIndex]: data.colorIndex != null,
            selected: data.selected
         }),
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
            widget.handleClick(e, instance);
         }
      };
      if (widget.tooltip) {
         shapeProps.ref = c => {
            this.el = c
         };
      }

      return <g className={data.classNames}>
         {!widget.hidden && shapeRenderer((bounds.l + bounds.r) / 2, (bounds.t + bounds.b) / 2, data.size, shapeProps)}
         {children}
      </g>;
   }

   componentWillUnmount() {
      tooltipParentWillUnmount(this.props.instance);
   }
   componentWillReceiveProps(props) {
      tooltipParentWillReceiveProps(this.el, props.instance, props.instance.widget.tooltip);
   }
   componentDidMount() {
      tooltipParentDidMount(this.el, this.props.instance, this.props.instance.widget.tooltip);
   }
}
