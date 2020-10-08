import {
   Chart,
   ColumnGraph,
   Gridlines,
   NumericAxis,
   TimeAxis
} from "cx/charts";
import { Rectangle, Svg } from "cx/svg";
import { Button, HtmlElement, Resizer } from "cx/widgets";
import { Controller, enableCultureSensitiveFormatting } from "cx/ui";

enableCultureSensitiveFormatting();

class PageController extends Controller {
   init() {
      super.init();

      this.store.init("width", 600);

      this.store.set(
         "$page.data",
         Array.from({ length: 5 * 12 }, (x, i) => ({
            date: Math.random() * 100,
            value: Math.random() * 1000
         }))
      );
   }
}

export default (
   <cx>
      <div>
         <div class="widgets" controller={PageController} style="display: flex;">
            <Svg style-tpl="width:{width}px;height:300px;" margin="60 60 60 60">
               <Chart
                  axes={{
                     x: <NumericAxis snapToTicks={2} minTickDistance={1} minLabelDistance={50} minTickSize={0.1} />,
                     y: <NumericAxis vertical />
                  }}
               >
                  <Rectangle fill="white" />
                  <Gridlines />
                  <ColumnGraph
                     data-bind="$page.data"
                     size={1}
                     offset={0.5}
                     xField="date"
                     yField="value"
                  />
               </Chart>
            </Svg>
            <Resizer size-bind="width" vertical style="background: red" />
         </div>
         <Button onClick={(e, { store }) => { store.toggle("dummy") }}>Toggle</Button>
      </div>
   </cx>
);
