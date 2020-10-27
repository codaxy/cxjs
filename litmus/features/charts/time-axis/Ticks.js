import { Chart, ColumnGraph, Gridlines, NumericAxis, TimeAxis } from "cx/charts";
import { Rectangle, Svg } from "cx/svg";
import { Button, HtmlElement, Resizer } from "cx/widgets";
import { Controller, enableCultureSensitiveFormatting } from "cx/ui";
import { zeroTime } from "cx/util";

enableCultureSensitiveFormatting();

class PageController extends Controller {
   init() {
      super.init();

      this.store.init("width", 600);

      this.store.set(
         "$page.data",
         Array.from({ length: 1 }, (x, i) => {
            let date = new Date(2020, 9, 13);
            date.setDate(date.getDate() + i);
            return {
               date: date.getTime(),
               value: Math.random() * 1000,
            };
         })
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
                     x: <TimeAxis snapToTicks={0} upperDeadZone={0} lowerDeadZone={0} />,
                     y: <NumericAxis vertical />,
                  }}
               >
                  <Rectangle fill="white" />
                  <Gridlines />
                  <ColumnGraph
                     data-bind="$page.data"
                     size={24 * 60 * 60 * 1000}
                     offset={12 * 60 * 60 * 1000}
                     xField="date"
                     yField="value"
                  />
               </Chart>
            </Svg>
            <Resizer size-bind="width" vertical style="background: red" />
         </div>
         <Button
            onClick={(e, { store }) => {
               store.toggle("dummy");
            }}
         >
            Toggle
         </Button>
      </div>
   </cx>
);
