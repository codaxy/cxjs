import { Line, Rectangle, Svg, Text } from "cx/svg";
import { ColorMap, Legend, PieChart, PieSlice, PieLabel, PieLabelsContainer } from "cx/charts";
import { Controller, KeySelection, LabelsTopLayout, Repeater } from "cx/ui";
import { HtmlElement, Slider } from "cx/widgets";

class PageController extends Controller {
   onInit() {
      this.store.init("count", 20);

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
               }))
            );
         },
         true
      );
   }
}

export default (
   <cx>
      <div class="widgets" controller={PageController} style="padding: 20px">
         <Legend />
         <div>
            <Svg style="width:600px; height:400px;">
               <ColorMap />
               <PieLabelsContainer>
                  <PieChart angle={360}>
                     <Repeater records-bind="points">
                        <PieSlice
                           value-bind="$record.value"
                           active-bind="$record.active"
                           colorMap="pie"
                           r={60}
                           r0={20}
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
                           innerPointRadius={60}
                           outerPointRadius={70}
                           name:bind="$record.name"
                           selection={{
                              type: KeySelection,
                              bind: "selection",
                              records: { bind: "points" },
                              record: { bind: "$record" },
                              index: { bind: "$index" },
                              keyField: "id",
                           }}
                        >
                           <Line style="stroke:gray" />
                           <Rectangle
                              visible={false}
                              anchors="1 1 1 1"
                              offset="-10 30 10 -30"
                              style="fill:white; stroke:red"
                           >
                              <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                           </Rectangle>

                           <PieLabel anchors="1 1 1 1" offset="-10 25 10 -25" distance-bind="distance">
                              <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                           </PieLabel>
                        </PieSlice>
                     </Repeater>
                  </PieChart>
               </PieLabelsContainer>
            </Svg>
            <LabelsTopLayout>
               <Slider
                  value-bind="count"
                  help-tpl="{count} points"
                  increment={1}
                  step={1}
                  minValue={1}
                  maxValue={50}
                  label="Points"
               />
               <Slider
                  value={{ bind: "distance", defaultValue: 100 }}
                  help-tpl="{distance:n;0}px"
                  minValue={0}
                  maxValue={500}
                  label="Distance"
               />
            </LabelsTopLayout>
         </div>
      </div>
   </cx>
);
