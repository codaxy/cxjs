import {Widget, VDOM} from '../ui/Widget'

export class LineGraph extends Widget {
   declareData() {
      super.declareData(...arguments, {
         data: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         class: {
            structured: true
         },
         className: {
            structured: true
         },
         lineStyle: {
            structured: true
         },
         areaStyle: {
            structured: true
         },
         area: undefined,
         line: undefined,
         y0: undefined,
         name: undefined,
         active: true,
         stack: undefined,
         stacked: undefined
      })
   }

   explore(context, instance) {
      var {data} = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);
      if (instance.colorMap && data.name)
         instance.colorMap.acknowledge(data.name);

      if (data.active) {
         instance.axes = context.axes;
         instance.xAxis = instance.axes[this.xAxis];
         instance.yAxis = instance.axes[this.yAxis];
         super.explore(context, instance);
         if (Array.isArray(data.data)) {
            data.data.forEach(p => {
               var x = p[this.xField];
               instance.xAxis.acknowledge(x);
               if (data.stacked) {
                  instance.yAxis.stacknowledge(data.stack, x, this.y0Field ? p[this.y0Field] : data.y0);
                  instance.yAxis.stacknowledge(data.stack, x, p[this.yField]);
               } else {
                  instance.yAxis.acknowledge(p[this.yField]);
                  if (data.area)
                     instance.yAxis.acknowledge(this.y0Field ? p[this.y0Field] : data.y0);
               }
            });
         }
      }
   }

   prepare(context, instance) {
      var {data, colorMap} = instance;

      if (colorMap && data.name) {
         data.colorIndex = colorMap.map(data.name);
         if (instance.colorIndex != data.colorIndex) {
            instance.colorIndex = data.colorIndex;
            instance.shouldUpdate = true;
         }
      }

      if (data.active) {
         super.prepare(context, instance);
         if (instance.axes[this.xAxis].shouldUpdate || instance.axes[this.yAxis].shouldUpdate)
            instance.shouldUpdate = true;
      }

      if (data.name && context.addLegendEntry)
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            //selected: this.selection.isInstanceSelected(instance),
            style: data.style,
            shape: 'rect',
            onClick: e=> { this.onLegendClick(e, instance) }
         });
   }

   onLegendClick(e, instance) {
      var allActions = this.legendAction == 'auto';
      var {data} = instance;
      if (allActions || this.legendAction == 'toggle')
         instance.set('active', !data.active)
   }

   render(context, instance, key) {
      var {data, xAxis, yAxis} = instance;

      if (!data.active)
         return null;

      var spans = [];
      var span = [];

      Array.isArray(data.data) && data.data.forEach(p => {

         var ax = p[this.xField],
            ay = p[this.yField],
            ay0 = this.y0Field ? p[this.y0Field] : data.y0,
            x, y, y0;

         if (ax != null && ay != null && ay0 != null) {
            x = xAxis.map(ax);
            y0 = data.stacked ? yAxis.stack(data.stack, ax, ay0) : yAxis.map(ay0);
            y = data.stacked ? yAxis.stack(data.stack, ax, ay) : yAxis.map(ay);
         }

         if (x != null && y != null && y0 != null)
            span.push({x, y, y0});
         else if (span.length > 0) {
            spans.push(span);
            span = [];
         }
      });

      if (span.length > 0)
         spans.push(span);

      var stateMods = {
         ['color-' + data.colorIndex]: data.colorIndex != null
      };

      var line, area;

      if (data.line) {
         let linePath = '';
         spans.forEach(span => {
            span.forEach((p, i) => {
               linePath += i == 0 ? ' M ' : ' L ';
               linePath += p.x + ' ' + p.y;
            });
         });

         line = <path className={this.CSS.element(this.baseClass, 'line', stateMods)} style={this.CSS.parseStyle(data.lineStyle)} d={linePath}/>;
      }

      if (data.area) {
         let areaPath = '';
         spans.forEach(span => {
            let closePath = '';
            span.forEach((p, i) => {
               areaPath += i == 0 ? ' M ' : ' L ';
               areaPath += p.x + ' ' + p.y;
               if (data.area)
                  closePath = `L ${p.x} ${p.y0} ` + closePath;
            });
            areaPath += closePath;
            areaPath += `L ${span[0].x} ${span[0].y}`;
         });
         area = <path className={this.CSS.element(this.baseClass, 'area', stateMods)} style={this.CSS.parseStyle(data.areaStyle)} d={areaPath}/>;
      }

      return <g key={key} className={data.classNames}>
         {line}
         {area}
      </g>;
   }


}

LineGraph.prototype.xAxis = 'x';
LineGraph.prototype.yAxis = 'y';
LineGraph.prototype.area = false;
LineGraph.prototype.line = true;

LineGraph.prototype.xField = 'x';
LineGraph.prototype.yField = 'y';
LineGraph.prototype.baseClass = 'linegraph';
LineGraph.prototype.pure = false;
LineGraph.prototype.y0 = 0;
LineGraph.prototype.y0Field = false;
LineGraph.prototype.active = true;
LineGraph.prototype.legend = 'legend';
LineGraph.prototype.legendAction = 'auto';
LineGraph.prototype.stack = 'stack';

Widget.alias('line-graph', LineGraph);