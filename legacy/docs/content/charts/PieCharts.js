import { Content, Repeater, Slider, Tab } from "cx/widgets";
import { Controller, KeySelection, LabelsTopLayout } from "cx/ui";
import { Svg, Text, Rectangle, Line } from "cx/svg";
import { PieChart, PieSlice, Legend, ColorMap } from "cx/charts";
import { Md } from "docs/components/Md";
import { CodeSplit } from "docs/components/CodeSplit";
import { CodeSnippet } from "docs/components/CodeSnippet";
import { ConfigTable } from "docs/components/ConfigTable";
import { ImportPath } from "docs/components/ImportPath";
import pieConfigs from "./configs/PieChart";
import sliceConfigs from "./configs/PieSlice";

class PageController extends Controller {
    onInit() {
        this.store.init("$page.start", 0);
        this.store.init("$page.angle", 360);
        this.store.init("$page.count", 7);
        this.store.init('$page.gap', 4);
        this.store.init('$page.r0', 50);
        this.store.init('$page.borderRadius', 6);

        this.addTrigger(
            "points",
            ["$page.count"],
            (count) => {
                this.store.set(
                    "$page.points",
                    Array.from({ length: count }, (_, i) => ({
                        id: i,
                        name: "Item " + (i + 1),
                        value: 10 + Math.random() * 30,
                        active: true,
                    }))
                );
            },
            true
        );
    }
}

export const PieCharts = (
    <cx>
        <Md>
            <CodeSplit>
                # Pie Charts
                <ImportPath path="import { PieChart, PieSlice } from 'cx/charts';" />
                Pie charts are commonly used to compare parts to the whole. In Cx, pie charts are implemented using
                `PieChart` and `PieSlice`.
                <div class="widgets" controller={PageController}>
                    <Legend />
                    <Svg style="width:600px; height:400px;">
                        <ColorMap />
                        <PieChart angle-bind="$page.angle" startAngle-bind="$page.start" gap-bind="$page.gap">
                            <Repeater records-bind="$page.points">
                                <PieSlice
                                    value-bind="$record.value"
                                    active-bind="$record.active"
                                    colorMap="pie"
                                    r={80}
                                    r0-bind="$page.r0"
                                    borderRadius-bind="$page.borderRadius"
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
                                    outerPointRadius={90}
                                    name-bind="$record.name"
                                    legendDisplayText-tpl="{$record.name} ({$record.value:n;1})"
                                    selection={{
                                        type: KeySelection,
                                        bind: "$page.selection",
                                        records: { bind: "$page.points" },
                                        record: { bind: "$record" },
                                        index: { bind: "$index" },
                                        keyField: "id",
                                    }}
                                >

                                    <Line style="stroke:gray" />
                                    <Rectangle anchors='1 1 1 1' offset="-10 20 10 -20" style="fill:white; stroke: gray">
                                        <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                                    </Rectangle>
                                </PieSlice>
                            </Repeater>
                        </PieChart>
                    </Svg>
                    <LabelsTopLayout columns={3}>
                        <Slider
                            value-bind="$page.count"
                            help-tpl="{$page.count} points"
                            increment={1}
                            step={1}
                            minValue={1}
                            maxValue={50}
                            label="Points"
                        />
                        <Slider
                            value-bind="$page.gap"
                            help-tpl="{$page.gap}px"
                            increment={1}
                            step={1}
                            minValue={0}
                            maxValue={50}
                            label="Gap"
                        />
                        <Slider
                            value-bind="$page.r0"
                            help-tpl="{$page.r0:ps;0}"
                            increment={1}
                            step={1}
                            minValue={0}
                            maxValue={70}
                            label="r0"
                        />
                        <Slider
                            value-bind="$page.borderRadius"
                            help-tpl="{$page.borderRadius:n;0}px"
                            increment={1}
                            step={1}
                            minValue={0}
                            maxValue={50}
                            label="Border Radius"
                        />
                        <Slider
                            value-bind="$page.start"
                            help-tpl="{$page.start:n;0}deg"
                            increment={1}
                            step={1}
                            minValue={0}
                            maxValue={270}
                            label="Start Angle"
                        />
                        <Slider
                            value-bind="$page.angle"
                            help-tpl="{$page.angle:n;0}deg"
                            increment={1}
                            step={1}
                            minValue={10}
                            maxValue={360}
                            label="Total Angle"
                        />
                    </LabelsTopLayout>
                </div>

                <Content name="code">
                    <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
                    <Tab value-bind="$page.code.tab" mod="code" tab="index" text="PieChart" default />

                    <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="9C63P156">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.init("$page.start", 0);
                            this.store.init("$page.angle", 360);
                            this.store.init("$page.count", 7);
                            this.store.init('$page.gap', 4);
                            this.store.init('$page.r0', 50);
                            this.store.init('$page.borderRadius', 6);

                            this.addTrigger(
                                "points",
                                ["$page.count"],
                                (count) => {
                                    this.store.set(
                                        "$page.points",
                                        Array.from({ length: count }, (_, i) => ({
                                            id: i,
                                            name: "Item " + (i + 1),
                                            value: 10 + Math.random() * 30,
                                            active: true,
                                        }))
                                    );
                                },
                                true
                            );
                        }
                    }
            `}</CodeSnippet>
            <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="9C63P156">{`
                <Legend />
                <Svg style="width:600px; height:400px;">
                    <ColorMap />
                    <PieChart angle-bind="$page.angle" startAngle-bind="$page.start" gap-bind="$page.gap">
                        <Repeater records-bind="$page.points">
                            <PieSlice
                                value-bind="$record.value"
                                active-bind="$record.active"
                                colorMap="pie"
                                r={80}
                                r0-bind="$page.r0"
                                borderRadius-bind="$page.borderRadius"
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
                                outerPointRadius={90}
                                name-bind="$record.name"
                                legendDisplayText-tpl="{$record.name} ({$record.value:n;1})"
                                selection={{
                                    type: KeySelection,
                                    bind: "$page.selection",
                                    records: { bind: "$page.points" },
                                    record: { bind: "$record" },
                                    index: { bind: "$index" },
                                    keyField: "id",
                                }}
                            >

                                <Line style="stroke:gray" />
                                <Rectangle anchors='1 1 1 1' offset="-10 20 10 -20" style="fill:white; stroke: gray">
                                    <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                                </Rectangle>
                            </PieSlice>
                        </Repeater>
                    </PieChart>
                </Svg>
                <LabelsTopLayout columns={3}>
                    <Slider
                        value-bind="$page.count"
                        help-tpl="{$page.count} points"
                        increment={1}
                        step={1}
                        minValue={1}
                        maxValue={50}
                        label="Points"
                    />
                    <Slider
                        value-bind="$page.gap"
                        help-tpl="{$page.gap}px"
                        increment={1}
                        step={1}
                        minValue={0}
                        maxValue={50}
                        label="Gap"
                    />
                    <Slider
                        value-bind="$page.r0"
                        help-tpl="{$page.r0:ps;0}"
                        increment={1}
                        step={1}
                        minValue={0}
                        maxValue={70}
                        label="r0"
                    />
                    <Slider
                        value-bind="$page.borderRadius"
                        help-tpl="{$page.borderRadius:n;0}px"
                        increment={1}
                        step={1}
                        minValue={0}
                        maxValue={50}
                        label="Border Radius"
                    />
                    <Slider
                        value-bind="$page.start"
                        help-tpl="{$page.start:n;0}deg"
                        increment={1}
                        step={1}
                        minValue={0}
                        maxValue={270}
                        label="Start Angle"
                    />
                    <Slider
                        value-bind="$page.angle"
                        help-tpl="{$page.angle:n;0}deg"
                        increment={1}
                        step={1}
                        minValue={10}
                        maxValue={360}
                        label="Total Angle"
                    />
                </LabelsTopLayout>
            `}</CodeSnippet>
                </Content>
            </CodeSplit>
            ## Examples

            * [Multi-level](~/examples/charts/pie/multi-level)
            * [Labels](~/charts/pie-labels)
            ## `PieChart` Configuration
            <ConfigTable props={pieConfigs} />
            ## `PieSlice` Configuration
            <ConfigTable props={sliceConfigs} />
        </Md>
    </cx>
);
