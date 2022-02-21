import { ColorMap, Legend, PieChart, PieSlice, PieLabelsContainer, PieLabel } from 'cx/charts';
import { Line, Rectangle, Svg, Text } from 'cx/svg';
import { Controller, KeySelection, LabelsTopLayout, Repeater } from 'cx/ui';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { CodeSplit } from 'docs/components/CodeSplit';
import { ConfigTable } from 'docs/components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';
import { Md } from 'docs/components/Md';
// import { PieLabel, PieLabelsContainer } from "../../../litmus/features/charts/pie/PieLabels";
import pieConfigs from './configs/PieChart';
import sliceConfigs from './configs/PieSlice';




class PageController extends Controller {
   init() {
      super.init();
      this.store.init("count", 20);
      this.store.init('distance', 50);

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

export const PieLabelsContainers = <cx>
   <Md>
      <CodeSplit>
         # Pie Labels Container

         <ImportPath path="import { PieLabelsContainer, PieLabel } from 'cx/charts';" />

         Pie Labels Container and Pie Label

         <div class="widgets" controller={PageController}>
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
                                 tpl: "Item {$index}: {$record.value:n;2}"
                              },
                              trackMouse: true,
                              globalMouseTracking: true,
                              destroyDelay: 50,
                              createDelay: 0,
                              animate: false
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
                              keyField: "id"
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
            </div>
         </div>

        
      </CodeSplit>

     

   </Md>
</cx>

