import {Widget, VDOM} from '../ui/Widget';
import {Selection} from '../ui/selection/Selection';
import {CSS} from '../ui/CSS';
import {isArray} from '../util/isArray';

export class BubbleGraph extends Widget {
   declareData() {

      var selection = this.selection.configureWidget(this);

      super.declareData(...arguments, {
         data: undefined,
         bubbleRadius: undefined,
         bubbleStyle: {
            structured: true
         }
      }, selection);
   }
   
   init() {
      this.selection = Selection.create(this.selection, {
         records: this.data
      });
      super.init();
   }

   explore(context, instance) {
      instance.axes = context.axes;
      super.explore(context, instance);
      var {data} = instance;
      if (isArray(data.data)) {
         data.data.forEach(p => {
            instance.axes[this.xAxis].acknowledge(p[this.xField]);
            instance.axes[this.yAxis].acknowledge(p[this.yField]);
         });
      }
   }

   prepare(context, instance) {
      super.prepare(context, instance);
      if (instance.axes[this.xAxis].shouldUpdate || instance.axes[this.yAxis].shouldUpdate)
         instance.markShouldUpdate(context);
   }

   render(context, instance, key) {
      var {data} = instance;
      return <g key={key} className={data.classNames}>
         {this.renderData(context, instance)}
      </g>;
   }

   renderData(context, instance) {
      var {data, axes, store} = instance;

      var xAxis = axes[this.xAxis];
      var yAxis = axes[this.yAxis];

      return isArray(data.data)
         && data.data.map((p, i) => {
            var selected = this.selection && this.selection.isSelected(store, p, i);
            var classes = CSS.element(this.baseClass, 'bubble', {
               selected: selected
            });
            return <circle key={i}
                           className={classes}
                           cx={xAxis.map(p[this.xField])}
                           cy={yAxis.map(p[this.yField])}
                           r={p[this.rField] || data.bubbleRadius}
                           style={p.style || data.bubbleStyle}
                           onClick={e=>{this.onBubbleClick(e, instance, i)}}
               />
         });
   }

   onBubbleClick(e, {data, store}, index) {
      var bubble = data.data[index];
      this.selection.select(store, bubble, index, {
         toggle: e.ctrlKey
      });
   }
}

BubbleGraph.prototype.baseClass = 'bubblegraph';
BubbleGraph.prototype.xAxis = 'x';
BubbleGraph.prototype.yAxis = 'y';

BubbleGraph.prototype.xField = 'x';
BubbleGraph.prototype.yField = 'y';
BubbleGraph.prototype.rField = 'r';

BubbleGraph.prototype.bubbleRadius = 10;

Widget.alias('bubble-graph', BubbleGraph);