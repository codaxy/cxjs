import {
   Chart,
   ColumnGraph,
   Gridlines,
   NumericAxis,
   TimeAxis
} from "cx/charts";
import { Rectangle, Svg } from "cx/svg";
import { HtmlElement, NumberField, DateField } from "cx/widgets";
import { Controller, enableCultureSensitiveFormatting, bind } from "cx/ui";

enableCultureSensitiveFormatting();


class PageController extends Controller {
   onInit() {
      this.store.load({
         yfrom: 100,
         yto: 1000,
         xfrom: new Date(2010, 0, 1).toISOString(),
         xto: new Date(2015, 0, 1).toISOString(),
         data: Array.from({length: 5 * 12}, (x, i) => ({
            date: new Date(2010, i, 1),
            value: Math.random() * 1000
         }))
      });
   }
}

export default <cx>
   <div class="widgets" controller={PageController}>
      <NumberField value:bind="yfrom"/>
      <NumberField value:bind="yto"/>
      <br/>
      <DateField value:bind="xfrom" />
      <DateField value:bind="xto" />

      <Svg style="width:600px;height:300px;" margin="60 60 60 60">
         <Chart axes={{
            x: <TimeAxis min={bind("xfrom")} max={bind("xto")}/>,
            y: <NumericAxis vertical min={bind("yfrom")} max={bind("yto")}/>,
         }}>
            <Rectangle fill="white"/>
            <Gridlines/>
            <ColumnGraph data:bind="data"
                         size={30 * 24 * 60 * 60 * 1000}
                         offset={15 * 24 * 60 * 60 * 1000}
                         xField="date"
                         yField="value"/>
         </Chart>
      </Svg>
   </div>
</cx>