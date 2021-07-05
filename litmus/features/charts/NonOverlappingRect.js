import {
   Chart, Gridlines, Marker,
   NumericAxis
} from "cx/charts";
import { NonOverlappingRect, NonOverlappingRectGroup, Rectangle, Svg, Text } from "cx/svg";
import { Controller, Repeater } from "cx/ui";

class PageController extends Controller {
   init() {
      super.init();
      this.store.set(
         "$page.data",
         Array.from({ length: 50 }, (_, i) => ({
            x: 100 + Math.random() * 300,
            y: Math.random() * 300,
            size: 10 + Math.random() * 30,
            color: Math.floor(Math.random() * 3)
         }))
      );
   }
}

export default (
   <cx>
      <div class="widgets" controller={PageController}>
         <Svg style="width:500px; height:450px;">
            <Chart
               offset="50 -20 -40 130"
               axes={{
                  x: { type: NumericAxis, snapToTicks: 1 },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}
            >
               <NonOverlappingRectGroup>
                  <Gridlines />
                  <Repeater records:bind="$page.data" recordName="$point">
                     <Marker
                        colorIndex:bind="$point.color"
                        size:bind="$point.size"
                        x:bind="$point.x"
                        y:bind="$point.y"
                        tooltip:tpl="Red ({$point.x:n;0}, {$point.y:n;0})"
                        style={{ fillOpacity: 0.5 }}
                        draggableX
                        draggableY
                     >
                        <NonOverlappingRect offset="-20 25 -5 -25" anchors="0 0.5 0 0.5">
                           <Rectangle style="fill: white; stroke: red; stroke-width: 0.5" anchors="0 1 1 0">
                              <Text value-tpl="{$point.x:n;0}, {$point.y:n;0}" textAnchor="middle" style="font-size: 10px" dy="0.35em" />
                           </Rectangle>
                        </NonOverlappingRect>
                     </Marker>
                  </Repeater>
               </NonOverlappingRectGroup>
            </Chart>
         </Svg>
      </div>
   </cx>
);
