import {Widget, VDOM} from '../ui/Widget';
import {ColumnBarGraphBase} from './ColumnBarGraphBase';
import {tooltipMouseMove, tooltipMouseLeave} from '../widgets/overlay/tooltip-ops';
import {isArray} from '../util/isArray';

export class BarGraph extends ColumnBarGraphBase {

   explore(context, instance) {
      super.explore(context, instance);

      let {data, yAxis, xAxis} = instance;

      if (isArray(data.data)) {
         data.data.forEach(p => {
            var x0 = this.x0Field ? p[this.x0Field] : data.x0;
            var y = p[this.yField];
            var x = p[this.xField];

            yAxis.acknowledge(y, data.size, data.offset);

            if (data.autoSize)
               yAxis.book(y, data.stacked ? data.stack : data.name);

            if (data.stacked) {
               xAxis.stacknowledge(data.stack, y, x0);
               xAxis.stacknowledge(data.stack, y, x);
            }
            else {
               if (!this.hiddenBase)
                  xAxis.acknowledge(x0);
               xAxis.acknowledge(x);
            }
         });
      }
   }

   renderGraph(context, instance) {
      var {data, yAxis, xAxis, store} = instance;

      if (!isArray(data.data))
         return false;

      var isSelected = this.selection.getIsSelectedDelegate(store);

      return data.data.map((p, i) => {

         var {offset, size} = data;

         var x0 = this.x0Field ? p[this.x0Field] : data.x0;
         var y = p[this.yField];
         var x = p[this.xField];

         if (data.autoSize) {
            var [index, count] = instance.yAxis.locate(y, data.stacked ? data.stack : data.name);
            offset = size / count * (index - count / 2 + 0.5);
            size = size / count;
         }

         var y1 = yAxis.map(y, offset - size / 2);
         var y2 = yAxis.map(y, offset + size / 2);
         var x1 = data.stacked ? xAxis.stack(data.stack, y, x0) : xAxis.map(x0);
         var x2 = data.stacked ? xAxis.stack(data.stack, y, x) : xAxis.map(x);

         var color = this.colorIndexField ? p[this.colorIndexField] : data.colorIndex;
         var state = {
            selected: isSelected(p, i),
            selectable: !this.selection.isDummy,
            [`color-${color}`]: color != null
         };

         let mmove, mleave;

         if (this.tooltip) {
            mmove = e => tooltipMouseMove(e, instance, this.tooltip, {
               target: e.target.parent,
               data: {
                  $record: p
               }
            });
            mleave = e => tooltipMouseLeave(e, instance, this.tooltip, {
               target: e.target.parent,
               data: {
                  $record: p
               }
            });
         }

         return <rect key={i}
            className={this.CSS.element(this.baseClass, 'bar', state)}
            onClick={e => {
               this.handleClick(e, instance, p, i)
            }}
            x={Math.min(x1, x2)}
            y={Math.min(y1, y2)}
            width={Math.abs(x2 - x1)}
            height={Math.abs(y2 - y1)}
            style={data.style}
            onMouseMove={mmove}
            onMouseLeave={mleave}
         />
      });
   }
}

BarGraph.prototype.baseClass = 'bargraph';
BarGraph.prototype.x0Field = false;
BarGraph.prototype.x0 = 0;
BarGraph.prototype.legendShape = 'bar';
BarGraph.prototype.hiddenBase = false;

Widget.alias('bargraph', BarGraph);