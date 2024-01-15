import { ColorMap, Legend, PieChart, PieLabel, PieLabelsContainer, PieSlice } from 'cx/charts';
import { Line, Rectangle, Svg, Text } from 'cx/svg';
import { Content, Controller, KeySelection, LabelsTopLayout, Repeater } from 'cx/ui';
import { Slider, Switch, Tab } from 'cx/widgets';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { CodeSplit } from 'docs/components/CodeSplit';
import { ConfigTable } from 'docs/components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';
import { Md } from 'docs/components/Md';
import pieConfigs from './configs/PieLabel';

const fiddleCode = 'vkbZc5Cw';

class PageController extends Controller {
   onInit() {
      this.store.init("count", 10);
      this.store.init('distance', 60);

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

export const PieLabels = <cx>
   <Md>
      <CodeSplit>
         # Pie Labels

         <ImportPath path="import { PieLabelsContainer, PieLabel } from 'cx/charts';" />

         `PieLabel`s are used to display values of each pie slice. They will automatically adjust position to accommodate for a large number of values.
         `PieLabel`s must be used inside of a `PieLabelsContainer` component.

         Use the `offset` property to define the bounding box of the label. Use the `distance` property to adjust the distance of the label from the pie chart.
         Text within can be centered, or auto-aligned to the left or right side if `autoTextAnchor` is set to `true`. In that case
         `anchors` have to be set `0.5 1 0.5 0` and `margin` can be used add extra space between the label and the lead line.

         <div class="widgets" controller={PageController} style="padding: 20px; display: block">
         <Legend />
         <div>
            <Svg style="height:400px">
               <ColorMap />
               <PieLabelsContainer>
                  <PieChart angle={360} margin="0 80 0 80">
                     <Repeater records-bind="points">
                        <PieSlice
                           value-bind="$record.value"
                           active-bind="$record.active"
                           colorMap="pie"
                           r={60}
                           r0={20}
                           offset={2}
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
                           name-bind="$record.name"
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

                           <PieLabel anchors="1 1 1 1" offset="-12 50 12 -50" distance-bind="distance" lineStroke="gray">
                                <Rectangle style="stroke: rgba(0, 0, 0, 0.1); fill: none" visible-expr="!{autoAlignLabels}"/>
                                <Text visible-expr="!{autoAlignLabels}" tpl="{$record.name} ({$record.value:n;1})" dy="0.37em" textAnchor="middle" />
                                <Text visible-expr="!!{autoAlignLabels}" tpl="{$record.name} ({$record.value:n;1})" dy="0.37em"  autoTextAnchor anchors="0.5 1 0.5 0" margin="0 5 0 5" />
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
                  value-bind="distance"
                  help-tpl="{distance:n;0}px"
                  minValue={0}
                  maxValue={500}
                  label="Distance"
               />
               <Switch value-bind="autoAlignLabels" label="Auto-align Labels" />
            </LabelsTopLayout>
         </div>
      </div>


      <Content name="code">
         <Tab value-bind="$page.code.tab" tab="controller" mod="code" text='Controller' />
         <Tab value-bind="$page.code.tab" tab="chart" mod="code" text="Chart" default />

      <CodeSnippet fiddle={fiddleCode}  visible-expr="{$page.code.tab}=='chart'">{`
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
                              name-bind="$record.name"
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
                              <PieLabel anchors="1 1 1 1" offset="-12 50 12 -50" distance-bind="distance" lineStroke="gray">
                                 <Rectangle style="stroke: rgba(0, 0, 0, 0.1); fill: none" visible-expr="!{autoAlignLabels}"/>
                                 <Text visible-expr="!{autoAlignLabels}" tpl="{$record.name} ({$record.value:n;1})" dy="0.37em" textAnchor="middle" />
                                 <Text visible-expr="!!{autoAlignLabels}" tpl="{$record.name} ({$record.value:n;1})" dy="0.37em"  autoTextAnchor anchors="0.5 1 0.5 0" margin="0 5 0 5" />
                              </PieLabel>
                           </PieSlice>
                        </Repeater>
                     </PieChart>
                  </PieLabelsContainer>
               </Svg>
            </div>
         </div>
         `}</CodeSnippet>

         <CodeSnippet fiddle={fiddleCode}  visible-expr="{$page.code.tab}=='controller'">{`
         class PageController extends Controller {
            onInit() {
               this.store.init("count", 10);
               this.store.init('distance', 60);

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
         }`}</CodeSnippet>
      </Content>

      </CodeSplit>

      ## Configuration

      <ConfigTable props={pieConfigs} />

   </Md>
</cx>
