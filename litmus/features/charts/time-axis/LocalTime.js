import { enableCultureSensitiveFormatting } from "cx/ui";
import { Svg, Rectangle } from "cx/svg";
import { Chart, TimeAxis, NumericAxis, Gridlines, ColumnGraph } from "cx/charts";
import { FlexRow } from "cx/widgets";

enableCultureSensitiveFormatting();

const TimeChart = ({ min, max }) => (
   <cx>
      <Svg style="flex:1 0 0%;height:200px;" margin="60 60 60 60">
         <Chart
            axes={{
               x: <TimeAxis min={min} max={max} snapToTicks={false} minLabelDistance={40} minTickDistance={40} />,
               y: <NumericAxis vertical />,
            }}
         >
            <Rectangle fill="white" />
            <Gridlines />
            <ColumnGraph
               data-bind="$page.data"
               size={30 * 24 * 60 * 60 * 1000}
               offset={15 * 24 * 60 * 60 * 1000}
               xField="date"
               yField="value"
            />
         </Chart>
      </Svg>
   </cx>
);

const show = "all";
const isVisible = (x) => show == "all" || show == x;

export default (
   <cx>
      <div>
         <FlexRow align={"center"} visible={isVisible("year")}>
            <TimeChart min={new Date(2000, 0, 1)} max={new Date(2001, 0, 1)} />
            <h2>Year</h2>
         </FlexRow>
         <hr />
         <FlexRow align={"center"} visible={isVisible("month")}>
            <TimeChart min={new Date(2000, 0, 1)} max={new Date(2000, 1, 1)} />
            <h2>Month</h2>
         </FlexRow>
         <hr />
         <FlexRow align={"center"} visible={isVisible("month")}>
            <TimeChart min={new Date(2017, 9, 1)} max={new Date(2017, 10, 1)} />
            <h2>Month</h2>
         </FlexRow>
         <hr />
         <FlexRow align={"center"} visible={isVisible("day")}>
            <TimeChart min={new Date(2000, 0, 1, 0, 0, 0)} max={new Date(2000, 0, 1, 12, 0, 0)} />
            <h2>Day</h2>
         </FlexRow>
      </div>
   </cx>
);
