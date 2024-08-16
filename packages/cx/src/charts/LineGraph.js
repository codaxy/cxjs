import { Widget, VDOM } from "../ui/Widget";
import { isArray } from "../util/isArray";
import { parseStyle } from "../util/parseStyle";

export class LineGraph extends Widget {
   declareData() {
      super.declareData(...arguments, {
         data: undefined,
         colorIndex: undefined,
         colorMap: undefined,
         class: {
            structured: true,
         },
         className: {
            structured: true,
         },
         lineStyle: {
            structured: true,
         },
         areaStyle: {
            structured: true,
         },
         area: undefined,
         line: undefined,
         y0: undefined,
         name: undefined,
         active: true,
         stack: undefined,
         stacked: undefined,
      });
   }

   prepareData(context, instance) {
      let { data } = instance;

      if (data.name && !data.colorName) data.colorName = data.name;

      super.prepareData(context, instance);
   }

   explore(context, instance) {
      let { data } = instance;

      instance.colorMap = data.colorMap && context.getColorMap && context.getColorMap(data.colorMap);

      if (instance.colorMap && data.colorName) instance.colorMap.acknowledge(data.colorName);

      if (data.active) {
         instance.axes = context.axes;
         instance.xAxis = instance.axes[this.xAxis];
         instance.yAxis = instance.axes[this.yAxis];
         super.explore(context, instance);
         if (isArray(data.data)) {
            data.data.forEach((p, index) => {
               let x = p[this.xField];
               instance.xAxis.acknowledge(x);
               if (data.stacked) {
                  instance.yAxis.stacknowledge(data.stack, x, this.y0Field ? p[this.y0Field] : data.y0);
                  instance.yAxis.stacknowledge(data.stack, x, p[this.yField]);
               } else {
                  instance.yAxis.acknowledge(p[this.yField]);
                  if (data.area) {
                     if (!this.hiddenBase) instance.yAxis.acknowledge(this.y0Field ? p[this.y0Field] : data.y0);
                  }
               }
            });
         }
      }
   }

   prepare(context, instance) {
      let { data, colorMap } = instance;

      if (colorMap && data.colorName) {
         data.colorIndex = colorMap.map(data.colorName);
         if (instance.cache("colorIndex", data.colorIndex)) instance.markShouldUpdate(context);
      }

      if (data.active) {
         if (instance.axes[this.xAxis].shouldUpdate || instance.axes[this.yAxis].shouldUpdate)
            instance.markShouldUpdate(context);
      }

      if (data.name && context.addLegendEntry) {
         context.addLegendEntry(this.legend, {
            name: data.name,
            active: data.active,
            colorIndex: data.colorIndex,
            disabled: data.disabled,
            style: {
               ...parseStyle(data.style),
               ...parseStyle(data.areaStyle),
               ...parseStyle(data.lineStyle),
            },
            shape: this.legendShape,
            onClick: (e) => {
               this.onLegendClick(e, instance);
            },
         });
      }

      if (data.active) {
         if (context.pointReducer && isArray(data.data)) {
            data.data.forEach((p, index) => {
               if (data.area && this.y0Field)
                  context.pointReducer(p[this.xField], p[this.y0Field], data.name, p, data, index);
               context.pointReducer(p[this.xField], p[this.yField], data.name, p, data.data, index);
            });
         }
      }

      instance.lineSpans = this.calculateLineSpans(context, instance);
   }

   onLegendClick(e, instance) {
      let allActions = this.legendAction == "auto";
      let { data } = instance;
      if (allActions || this.legendAction == "toggle") instance.set("active", !data.active);
   }

   calculateLineSpans(context, instance) {
      let { data, xAxis, yAxis } = instance;
      let spans = [];
      let span = [];

      if (!data.active) return null;

      isArray(data.data) &&
         data.data.forEach((p) => {
            let ax = p[this.xField],
               ay = p[this.yField],
               ay0 = this.y0Field ? p[this.y0Field] : data.y0,
               x,
               y,
               y0;

            if (ax != null && ay != null && ay0 != null) {
               x = xAxis.map(ax);
               y0 = data.stacked ? yAxis.stack(data.stack, ax, ay0) : yAxis.map(ay0);
               y = data.stacked ? yAxis.stack(data.stack, ax, ay) : yAxis.map(ay);
            }

            if (x != null && y != null && y0 != null) span.push({ x, y, y0 });
            else if (span.length > 0) {
               spans.push(span);
               span = [];
            }
         });

      if (span.length > 0) spans.push(span);
      return spans;
   }

   render(context, instance, key) {
      let { data, lineSpans } = instance;

      if (!lineSpans) return null;

      let stateMods = {
         ["color-" + data.colorIndex]: data.colorIndex != null,
      };

      let line, area;

      if (data.line) {
         let linePath = "";
         lineSpans.forEach((span) => {
            span.forEach((p, i) => {
               linePath += i == 0 ? " M " : " L ";
               linePath += p.x + " " + p.y;
            });
         });

         line = (
            <path
               className={this.CSS.element(this.baseClass, "line", stateMods)}
               style={this.CSS.parseStyle(data.lineStyle)}
               d={linePath}
            />
         );
      }

      if (data.area) {
         let areaPath = "";
         lineSpans.forEach((span) => {
            let closePath = "";
            span.forEach((p, i) => {
               areaPath += i == 0 ? " M " : " L ";
               areaPath += p.x + " " + p.y;
               if (data.area) closePath = `L ${p.x} ${p.y0} ` + closePath;
            });
            areaPath += closePath;
            areaPath += `L ${span[0].x} ${span[0].y}`;
         });
         area = (
            <path
               className={this.CSS.element(this.baseClass, "area", stateMods)}
               style={this.CSS.parseStyle(data.areaStyle)}
               d={areaPath}
            />
         );
      }

      return (
         <g key={key} className={data.classNames}>
            {line}
            {area}
         </g>
      );
   }
}

LineGraph.prototype.xAxis = "x";
LineGraph.prototype.yAxis = "y";
LineGraph.prototype.area = false;
LineGraph.prototype.line = true;

LineGraph.prototype.xField = "x";
LineGraph.prototype.yField = "y";
LineGraph.prototype.baseClass = "linegraph";
LineGraph.prototype.y0 = 0;
LineGraph.prototype.y0Field = false;
LineGraph.prototype.active = true;
LineGraph.prototype.legend = "legend";
LineGraph.prototype.legendAction = "auto";
LineGraph.prototype.legendShape = "rect";
LineGraph.prototype.stack = "stack";
LineGraph.prototype.hiddenBase = false;

Widget.alias("line-graph", LineGraph);
