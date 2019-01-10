import {VDOM} from '../ui/Widget';
import {PureContainer} from '../ui/PureContainer';
import {tooltipMouseMove, tooltipMouseLeave} from '../widgets/overlay/tooltip-ops';
import {Selection} from '../ui/selection/Selection';

export class ColumnBarBase extends PureContainer {

   init() {
      this.selection = Selection.create(this.selection);
      super.init();
   }

   declareData() {
      var selection = this.selection.configureWidget(this);

      return super.declareData(...arguments, selection, {
         x: undefined,
         y: undefined,
         style: {structured: true},
         class: {structured: true},
         className: {structured: true},
         disabled: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         colorName: undefined,
         name: undefined,
         active: true,
         stacked: undefined,
         stack: undefined,
         offset: undefined
      });
   }

   prepareData(context, instance) {
      instance.axes = context.axes;
      instance.xAxis = context.axes[this.xAxis];
      instance.yAxis = context.axes[this.yAxis];
      var {data} = instance;
      data.valid = this.checkValid(data);
      if (!data.colorName && data.name)
         data.colorName = data.name;
      super.prepareData(context, instance);
   }

   checkValid(data) {
      return true;
   }

   prepare(context, instance) {
      let {data, colorMap} = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache('colorIndex', data.colorIndex))
            instance.markShouldUpdate(context);
      }

      if (!data.valid)
         return;

      if (data.active) {
         instance.bounds = this.calculateRect(instance);
         instance.cache('bounds', instance.bounds);
         if (!instance.bounds.isEqual(instance.cached.bounds))
            instance.markShouldUpdate(context);

         context.push('parentRect', instance.bounds);
         if (instance.xAxis.shouldUpdate || instance.yAxis.shouldUpdate)
            instance.markShouldUpdate(context);
      }

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            selected: this.selection.isInstanceSelected(instance),
            style: data.style,
            shape: this.legendShape,
            onClick: e => {
               this.onLegendClick(e, instance)
            }
         });
   }

   prepareCleanup(context, instance) {
      let {data} = instance;
      if (data.valid && data.active)
         context.pop('parentRect');
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

   calculateRect(context, instance) {
      throw new Error('Abstract method.')
   }

   render(context, instance, key) {
      let {data, bounds} = instance;

      if (!data.active || !data.valid)
         return null;

      var stateMods = {
         selected: this.selection.isInstanceSelected(instance),
         disabled: data.disabled,
         selectable: !this.selection.isDummy,
         ['color-' + data.colorIndex]: data.colorIndex != null
      };

      return <g className={data.classNames} key={key}>
         <rect
            className={this.CSS.element(this.baseClass, 'rect', stateMods)}
            style={data.style}
            x={bounds.l}
            y={bounds.t}
            width={Math.max(0.0001, bounds.width())}
            height={Math.max(0.0001, bounds.height())}
            onMouseMove={e => {
               tooltipMouseMove(e, instance, this.tooltip)
            }}
            onMouseLeave={e => {
               tooltipMouseLeave(e, instance, this.tooltip)
            }}
            onClick={e => {
               this.handleClick(e, instance)
            }}
         />
         {this.renderChildren(context, instance)}
      </g>;
   }

   handleClick(e, instance) {
      if (!this.selection.isDummy) {
         this.selection.selectInstance(instance);
         e.stopPropagation();
         e.preventDefault();
      }
   }
}

ColumnBarBase.prototype.xAxis = 'x';
ColumnBarBase.prototype.yAxis = 'y';
ColumnBarBase.prototype.offset = 0;
ColumnBarBase.prototype.legend = 'legend';
ColumnBarBase.prototype.legendAction = 'auto';
ColumnBarBase.prototype.active = true;
ColumnBarBase.prototype.stacked = false;
ColumnBarBase.prototype.stack = 'stack';
ColumnBarBase.prototype.legendShape = 'rect';
ColumnBarBase.prototype.styled = true;