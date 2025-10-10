import { Bar, CategoryAxis, Chart, Gridlines, TimeAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, enableCultureSensitiveFormatting, Format, Repeater } from "cx/ui";
import { casual } from "../../../casual";

enableCultureSensitiveFormatting();

class PageController extends Controller {
   onInit() {
      let start = new Date(2020, 1, 1).valueOf();
      let yearMs = 365 * 24 * 3600 * 1000;

      this.store.init(
         "$page.points",
         Array.from({ length: 15 }, (_, i) => ({
            id: i,
            city: casual.city + "; US",
            start: start + Math.random() * 1 * yearMs,
            duration: Math.random() * 0.5 * yearMs,
         })),
      );
   }
}

export default (
   <cx>
      <div class="widgets" style="padding: 20px" controller={PageController}>
         <div>
            <Svg style="width:600px; height:600px;">
               <Chart
                  offset="20 -20 -40 120"
                  axes={{
                     y: (
                        <cx>
                           <CategoryAxis
                              vertical
                              inverted
                              labelLineHeight={1.3}
                              onCreateLabelFormatter={() => (formattedValue, value) => {
                                 let parts = formattedValue.split(";");
                                 return [{ text: parts[0], style: { fontWeight: 600 } }, { text: parts[1] }];
                              }}
                           />
                        </cx>
                     ),
                     x: (
                        <TimeAxis
                           snapToTicks={0}
                           format={"datetime;MMMyyyy"}
                           labelLineHeight={1.3}
                           onCreateLabelFormatter={() => (formattedValue, value) => {
                              let parts = formattedValue.split(" ");
                              let result = [{ text: parts[0] }];
                              let color = parts[0] == "Jan" ? "red" : null;
                              if (parts[0] == "Jan")
                                 result.push({
                                    text: parts[1],
                                    style: { fontWeight: 600, color },
                                    data: { value, formattedValue },
                                 });
                              return result;
                           }}
                        />
                     ),
                  }}
               >
                  <Repeater records-bind="$page.points" recordAlias="$point" sorters-bind="$page.sorters">
                     <Bar
                        colorIndex={3}
                        style="stroke:none;opacity:0.3"
                        x0-bind="$point.start"
                        x-expr="{$point.start} + {$point.duration}"
                        y-bind="$point.city"
                        size={0.5}
                     />
                  </Repeater>
                  <Gridlines />
               </Chart>
            </Svg>
         </div>
      </div>
   </cx>
);
