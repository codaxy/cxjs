import { Chart, Gridlines, Marker, MarkerLine, NumericAxis, PointReducer } from "cx/charts";
import { Svg, Text } from "cx/svg";
import { Controller, Repeater } from "cx/ui";
import { Slider } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      this.store.set(
         "$page.points",
         Array.from({ length: 15 }, (_, i) => ({
            x: Math.random() * 300,
            y: Math.random() * 300,
            size: 15 + Math.random() * 30,
            color: Math.floor(Math.random() * 16),
         })),
      );

      var y1 = 150,
         y2 = 250;
      this.store.set(
         "$page.points2",
         Array.from({ length: 101 }, (_, i) => ({
            x: i * 4,
            y: i % 20 == 3 ? null : (y1 = y1 + (Math.random() - 0.5) * 30),
            y2: (y2 = y2 + (Math.random() - 0.5) * 30),
            y2l: y2 - 50,
            y2h: y2 + 50,
         })),
      );
   }
}

export default (
   <cx>
      <div class="widgets" style="padding: 20px" controller={PageController}>
         <Slider
            min={15}
            max={44}
            step={1}
            value-bind="$page.pointSize"
            label="Point size"
            help-tpl="{$page.pointSize} units"
         />
         <div text-tpl="Avg size for {$page.count} markers:"></div>
         <Svg style="width:800px;height:600px;" margin="30 30 30 50">
            <Chart
               axes={{
                  x: <NumericAxis min={0} max={300} />,
                  y: <NumericAxis min={0} max={300} vertical />,
               }}
            >
               <Gridlines />
               <PointReducer
                  onInitAccumulator={(acc) => {
                     acc.sumX = 0;
                     acc.sumY = 0;
                     acc.sumSize = 0;
                     acc.count = 0;
                  }}
                  onMap={(acc, x, y, name, p) => {
                     acc.sumX += x * p.size;
                     acc.sumY += y * p.size;
                     acc.sumSize += p.size;
                     acc.count++;
                  }}
                  onReduce={(acc, { store }) => {
                     if (acc.sumSize > 0) {
                        store.set("$page.avgX", acc.sumX / acc.sumSize);
                        store.set("$page.avgY", acc.sumY / acc.sumSize);
                     }

                     store.set("$page.count", acc.count);
                  }}
                  filterParams-bind="$page.pointSize"
                  onCreatePointFilter={(pointSize, instance) => {
                     instance.store.delete("$page.avgX", "$page.avgY", "$page.count");
                     return (x, y, name, data, array, index) => {
                        return data.size >= pointSize;
                     };
                  }}
               >
                  <Repeater records-bind="$page.points" recordAlias="$point">
                     <Marker
                        colorIndex-bind="$point.color"
                        size-bind="$point.size"
                        x-bind="$point.x"
                        y-bind="$point.y"
                        style={{ fillOpacity: 0.5 }}
                        draggableX
                        draggableY
                        value-bind="$point.size"
                     >
                        <Text value-tpl="{$point.size:n;0}" style="font-size: 11px" offset={"5 0 0 -7"} />
                     </Marker>
                  </Repeater>

                  <MarkerLine x-bind="$page.avgX" visible-bind="$page.avgX" />
                  <MarkerLine y-bind="$page.avgY" visible-bind="$page.avgY" />
               </PointReducer>
            </Chart>
         </Svg>
      </div>
   </cx>
);
