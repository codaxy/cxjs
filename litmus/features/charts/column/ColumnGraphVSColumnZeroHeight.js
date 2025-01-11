import { CategoryAxis, Chart, Column, ColumnGraph, Gridlines, Legend, NumericAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, Repeater } from "cx/ui";
import { casual } from "docs/content/examples/data/casual";

class PageController extends Controller {
   init() {
      super.init();

      this.store.set(
         "$page.points",
         Array.from({ length: 30 }, (_, i) => ({
            x: casual.city,
            y: Math.random() < 0.5 ? 0 : Math.random(),
         })),
      );
   }
}

export default (
   <cx>
      <div class="widgets" style="display: flex; flex-direction: row; gap: 50px" controller={PageController}>
         <Svg style="width:600px; height:400px;">
            <Chart
               offset="20 -20 -140 40"
               axes={{
                  x: {
                     type: CategoryAxis,
                     labelRotation: -90,
                     labelDy: "0.4em",
                     labelAnchor: "end",
                  },
                  y: { type: NumericAxis, vertical: true },
               }}
            >
               <Gridlines />
               <Repeater records-bind="$page.points" recordName="$point">
                  <Column
                     colorIndex-expr="15 - Math.round({$point.y}*6/50)"
                     width={0.8}
                     x-bind="$point.x"
                     y-bind="$point.y"
                     tooltip-tpl="{$point.x} {$point.y:n;0}"
                     minPixelHeight={0}
                     //  hidden-expr="{$point.y} == 0"
                  />
               </Repeater>
            </Chart>
         </Svg>

         <Svg style="width:600px; height:400px;">
            <Chart
               offset="20 -20 -140 40"
               axes={{
                  x: {
                     type: CategoryAxis,
                     labelRotation: -90,
                     labelDy: "0.4em",
                     labelAnchor: "end",
                  },
                  y: { type: NumericAxis, vertical: true },
               }}
            >
               <Gridlines />
               <ColumnGraph data-bind="$page.points" colorIndex={0} name="V1" size={0.3} offset={-0.15} yField="y" />
            </Chart>
         </Svg>
      </div>
   </cx>
);
