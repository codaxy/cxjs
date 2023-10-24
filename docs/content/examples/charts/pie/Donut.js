import { Content, HtmlElement, Repeater, Slider, Tab } from 'cx/widgets';
import { Controller, KeySelection, LabelsTopLayout } from 'cx/ui';
import { Svg, Text, Rectangle, Line } from 'cx/svg';
import { PieChart, PieSlice, Legend, ColorMap } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

const fiddleCode = 'vkbZc5Cw';

class PageController extends Controller {
   init() {
      super.init();
      this.store.init("$page.gap", 5);
      this.store.set('$page.points', Array.from({length: 7}, (_, i) => ({
        id: i,
        name: 'Item ' + (i+1),
        value: 100 + (Math.random() - 0.5) * 30,
     })));
   }
}

export const Donut = <cx>
   <Md>
      <CodeSplit>
        # Donut Charts

        This example shows how to implement donut chart.

         <div class="widgets" controller={PageController}>
            <Legend />
            <Svg style="width:600px; height:400px;">
               <ColorMap />
                <PieChart angle={360} gap-bind='$page.gap'>
                    <Repeater records-bind="$page.points">
                    <PieSlice
                        value-bind="$record.value"
                    //    active-bind="$record.active"
                        colorMap="pie"
                        r={80}
                        r0={20}
                    //    offset={5}
                    //    tooltip={{
                    //       text: {
                    //          tpl: "Item {$index}: {$record.value:n;2}",
                    //       },
                    //       trackMouse: true,
                    //       globalMouseTracking: true,
                    //       destroyDelay: 50,
                    //       createDelay: 0,
                    //       animate: false,
                    //    }}
                    //    innerPointRadius={60}
                    //    outerPointRadius={70}
                        name-bind="$record.name"
                    //    selection={{
                    //       type: KeySelection,
                    //       bind: "selection",
                    //       records: { bind: "points" },
                    //       record: { bind: "$record" },
                    //       index: { bind: "$index" },
                    //       keyField: "id",
                    //    }}
                    >
                        {/* <Line style="stroke:gray" />
                        <Rectangle
                            visible={false}
                            anchors="1 1 1 1"
                            offset="-10 30 10 -30"
                            style="fill:white; stroke:red"
                        >
                            <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                        </Rectangle> */}

                        {/* <PieLabel anchors="1 1 1 1" offset="-10 25 10 -25" distance-bind="distance" lineStroke="gray">
                            <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                        </PieLabel> */}
                    </PieSlice>
                    </Repeater>
                </PieChart>
            </Svg>
            <LabelsTopLayout>
               <Slider
                  value-bind="$page.gap"
                  help-tpl="{$page.gap}"
                  increment={1}
                  step={1}
                  minValue={0}
                  maxValue={20}
                  label="Gap"
               />
            </LabelsTopLayout>
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

                            <PieLabel anchors="1 1 1 1" offset="-10 25 10 -25" distance-bind="distance"  lineStroke="gray">
                                <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
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
                this.store.init('distance', 85);

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
   </Md>
</cx>

