import { Controller, Repeater, Text, bind } from "cx/ui";
import { Line, Rectangle, Svg } from "cx/svg";
import { ColorMap, Pie, PieChart, PieSlice } from "cx/charts";
import { enableTooltips, HtmlElement, LinkButton } from "cx/widgets";

enableTooltips();

class PageController extends Controller {
   onInit() {
      this.store.init("count", 5);

      this.addTrigger(
         "points",
         ["count"],
         (count) => {
            this.store.set(
               "points",
               Array.from({ length: count }, (_, i) => ({
                  id: i,
                  name: "Item " + (i + 1),
                  value: Math.random() * 30,
                  active: true,
               })),
            );
         },
         true,
      );
   }
}

export default (
   <cx>
      <LinkButton text="Link Button" tooltip="lb" href="#" />
      <Svg style="width:600px; height:400px;" controller={PageController}>
         <ColorMap />
         <PieChart>
            <Repeater records-bind="points" idField="id">
               <PieSlice
                  value-bind="$record.value"
                  active-bind="$record.active"
                  //   colorMap="pie"
                  r={60}
                  r0={40}
                  offset={5}
                  tooltip={{
                     text: {
                        tpl: "Item {$index}: {$record.value:n;2}",
                     },
                     trackMouse: true,
                     globalMouseTracking: true,
                     destroyDelay: 50,
                     createDelay: 0,
                     animate: false,
                  }}
                  innerPointRadius={50}
                  outerPointRadius={70}
                  name-bind="$record.name"
                  colorIndex-bind="$index"
               />
            </Repeater>
         </PieChart>
      </Svg>
   </cx>
);
