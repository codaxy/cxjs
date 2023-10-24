import { Content, FlexCol, FlexRow, HtmlElement, Repeater, Slider, Tab } from 'cx/widgets';
import { Controller, KeySelection, LabelsTopLayout } from 'cx/ui';
import { Svg, Text, Rectangle, Line } from 'cx/svg';
import { PieChart, PieSlice, Legend, ColorMap } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

class PageController extends Controller {
   init() {
      super.init();
      this.store.init("$page.gap", 5);
      this.store.init("$page.r0", 50);

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

        This example shows how to implement donut chart with arbitrary inner radius and gap between slices.

        <div class="widgets" controller={PageController}>
            <FlexRow>
                <Svg style="width:550px; height:400px;">
                    <ColorMap />
                    <PieChart angle={360} gap-bind='$page.gap'>
                        <Repeater records-bind="$page.points">
                            <PieSlice
                                value-bind="$record.value"
                                active-bind="$record.active"
                                colorMap="pie"
                                r={80}
                                r0-bind='$page.r0'
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
                                innerPointRadius={80}
                                outerPointRadius={95}
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
                                <Rectangle anchors='1 1 1 1' offset="-10 20 10 -20" style="fill:white">
                                    <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                                </Rectangle>
                            </PieSlice>
                        </Repeater>
                    </PieChart>
                </Svg>
                <FlexCol justify='space-around'>
                    <Legend vertical />
                </FlexCol>
            </FlexRow>

            <LabelsTopLayout mod='stretch' style='margin-left: 40px'>
                <Slider
                    value={{ bind: "$page.r0", debounce: 300 }}
                    help-tpl="{$page.r0} pixels"
                    increment={1}
                    step={1}
                    minValue={0}
                    maxValue={70}
                    label="Inner Radius"
                />
                <Slider
                    value={{ bind: "$page.gap", debounce: 300 }}
                    help-tpl="{$page.gap} pixels"
                    increment={1}
                    step={1}
                    minValue={0}
                    maxValue={25}
                    label="Gap"
                />
            </LabelsTopLayout>
        </div>

        **Note:** Distance between slices can as well be achieved with `Pie Slice's` `offset` property, however this affects the circle shape and is recommended to use it to *slice out* specific slices.

      <Content name="code">
         <Tab value-bind="$page.code.tab" tab="controller" mod="code" text='Controller' />
         <Tab value-bind="$page.code.tab" tab="chart" mod="code" text="Chart" default />

        <CodeSnippet visible-expr="{$page.code.tab}=='chart'">{`
            <div class="widgets" controller={PageController}>
                <FlexRow>
                    <Svg style="width:550px; height:400px;">
                        <ColorMap />
                        <PieChart angle={360} gap-bind='$page.gap'>
                            <Repeater records-bind="$page.points">
                                <PieSlice
                                    value-bind="$record.value"
                                    active-bind="$record.active"
                                    colorMap="pie"
                                    r={80}
                                    r0-bind='$page.r0'
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
                                    innerPointRadius={80}
                                    outerPointRadius={95}
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
                                    <Rectangle anchors='1 1 1 1' offset="-10 20 10 -20" style="fill:white">
                                        <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                                    </Rectangle>
                                </PieSlice>
                            </Repeater>
                        </PieChart>
                    </Svg>
                    <FlexCol justify='space-around'>
                        <Legend vertical />
                    </FlexCol>
                </FlexRow>

                <LabelsTopLayout mod='stretch' style='margin-left: 40px'>
                    <Slider
                        value={{ bind: "$page.r0", debounce: 300 }}
                        help-tpl="{$page.r0} pixels"
                        increment={1}
                        step={1}
                        minValue={0}
                        maxValue={70}
                        label="Inner Radius"
                    />
                    <Slider
                        value={{ bind: "$page.gap", debounce: 300 }}
                        help-tpl="{$page.gap} pixels"
                        increment={1}
                        step={1}
                        minValue={0}
                        maxValue={25}
                        label="Gap"
                    />
                </LabelsTopLayout>
            </div>
            `}</CodeSnippet>

            <CodeSnippet visible-expr="{$page.code.tab}=='controller'">{`
            class PageController extends Controller {
                init() {
                    super.init();
                    this.store.init("$page.gap", 5);
                    this.store.init("$page.r0", 50);

                    this.store.set('$page.points', Array.from({length: 7}, (_, i) => ({
                      id: i,
                      name: 'Item ' + (i+1),
                      value: 100 + (Math.random() - 0.5) * 30,
                   })));
                 }
            }`}</CodeSnippet>
        </Content>
      </CodeSplit>
   </Md>
</cx>

