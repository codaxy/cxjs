import {Widget, VDOM} from '../ui/Widget';
import {ColumnBarGraphBase} from './ColumnBarGraphBase';
import {tooltipMouseMove, tooltipMouseLeave} from '../widgets/overlay/tooltip-ops';
import {isArray} from '../util/isArray';

export class ColumnGraph extends ColumnBarGraphBase {

   explore(context, instance) {
      super.explore(context, instance);

      let {data, xAxis, yAxis} = instance;

      if (isArray(data.data)) {
         data.data.forEach((p, index) => {
            var y0 = this.y0Field ? p[this.y0Field] : data.y0;
            var x = p[this.xField];
            var y = p[this.yField];

            xAxis.acknowledge(x, data.size, data.offset);

            if (data.autoSize)
               xAxis.book(x, data.stacked ? data.stack : data.name);

            if (data.stacked) {
               yAxis.stacknowledge(data.stack, x, y0);
               yAxis.stacknowledge(data.stack, x, y);
            }
            else {
               if (!this.hiddenBase)
                  yAxis.acknowledge(y0);
               yAxis.acknowledge(y);
            }

            if (context.pointReducer)
               context.pointReducer(x, y, data.name, p, data, index);
         });
      }
   }

   renderGraph(context, instance) {
      var {data, xAxis, yAxis, store} = instance;

      if (!isArray(data.data))
         return false;

      var isSelected = this.selection.getIsSelectedDelegate(store);

      return data.data.map((p, i) => {

         var {offset, size} = data;

         var y0 = this.y0Field ? p[this.y0Field] : data.y0;
         var x = p[this.xField];
         var y = p[this.yField];

         if (data.autoSize) {
            var [index, count] = instance.xAxis.locate(x, data.stacked ? data.stack : data.name);
            offset = size / count * (index - count / 2 + 0.5);
            size = size / count;
         }

         var x1 = xAxis.map(x, offset - size / 2);
         var x2 = xAxis.map(x, offset + size / 2);
         var y1 = data.stacked ? yAxis.stack(data.stack, x, y0) : yAxis.map(y0);
         var y2 = data.stacked ? yAxis.stack(data.stack, x, y) : yAxis.map(y);

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

         return <rect
            key={i}
            className={this.CSS.element(this.baseClass, 'column', state)}
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

ColumnGraph.prototype.baseClass = 'columngraph';
ColumnGraph.prototype.y0Field = false;
ColumnGraph.prototype.y0 = 0;
ColumnGraph.prototype.legendShape = 'column';
ColumnGraph.prototype.hiddenBase = false;

Widget.alias('columngraph', ColumnGraph);