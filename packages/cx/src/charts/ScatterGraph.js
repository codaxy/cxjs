import {Widget, VDOM} from '../ui/Widget';
import {Selection} from '../ui/selection/Selection';
import {CSS} from '../ui/CSS';
import {getShape} from './shapes';
import {isArray} from '../util/isArray';

export class ScatterGraph extends Widget {

   init() {
      this.selection = Selection.create(this.selection, {
         records: this.data
      });
      super.init();
   }

   declareData() {

      var selection = this.selection.configureWidget(this);

      super.declareData(...arguments, {
         data: undefined,
         size: undefined,
         shape: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         colorName: undefined,
         name: undefined,
         active: true
      }, selection);
   }

   prepareData(context, instance) {
      let {data} = instance;

      if (data.name && !data.colorName)
         data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context, instance) {
      super.explore(context, instance);

      var xAxis = instance.xAxis = context.axes[this.xAxis];
      var yAxis = instance.yAxis = context.axes[this.yAxis];

      var {data} = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.colorName)
         instance.colorMap.acknowledge(data.colorName);

      if (data.active && isArray(data.data)) {
         data.data.forEach(p => {
            xAxis.acknowledge(p[this.xField]);
            yAxis.acknowledge(p[this.yField]);
         });
      }
   }

   prepare(context, instance) {

      var {data, xAxis, yAxis, colorMap} = instance;

      if (xAxis.shouldUpdate || yAxis.shouldUpdate)
         instance.markShouldUpdate(context);

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache('colorIndex', data.colorIndex))
            instance.markShouldUpdate(context);
      }

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            style: data.style,
            shape: data.shape,
            onClick: e=> { this.onLegendClick(e, instance) }
         });
   }

   onLegendClick(e, instance) {
      var allActions = this.legendAction == 'auto';
      var {data} = instance;
      if (allActions || this.legendAction == 'toggle')
         instance.set('active', !data.active);
   }

   render(context, instance, key) {
      var {data} = instance;
      return <g key={key} className={data.classNames}>
         {this.renderData(context, instance)}
      </g>;
   }

   renderData(context, instance) {
      var {data, xAxis, yAxis, store} = instance;

      if (!data.active)
         return null;

      var shape = getShape(data.shape);

      var isSelected = this.selection.getIsSelectedDelegate(store);

      return isArray(data.data)
         && data.data.map((p, i) => {

            var classes = CSS.element(this.baseClass, 'shape', {
               selected: isSelected(p, i),
               selectable: !this.selection.isDummy,
               [`color-${data.colorIndex}`]: data.colorIndex != null
            });

            var cx = xAxis.map(p[this.xField]),
               cy = yAxis.map(p[this.yField]),
               size = this.sizeField ? p[this.sizeField] : data.size;

            return shape(cx, cy, size, {
               key: i,
               className: classes,
               style: p.style || data.style,
               onClick: e=> {
                  this.handleItemClick(e, instance, i)
               }
            });
         });
   }

   handleItemClick(e, {data, store}, index) {
      var bubble = data.data[index];
      this.selection.select(store, bubble, index, {
         toggle: e.ctrlKey
      });
   }
}

ScatterGraph.prototype.baseClass = 'scattergraph';
ScatterGraph.prototype.xAxis = 'x';
ScatterGraph.prototype.yAxis = 'y';

ScatterGraph.prototype.xField = 'x';
ScatterGraph.prototype.yField = 'y';
ScatterGraph.prototype.sizeField = false;
ScatterGraph.prototype.shape = 'circle';

ScatterGraph.prototype.size = 10;
ScatterGraph.prototype.legend = 'legend';
ScatterGraph.prototype.legendAction = 'auto';
ScatterGraph.prototype.styled = true;

Widget.alias('scatter-graph', ScatterGraph);