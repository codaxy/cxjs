import { Content, Slider, Switch, Tab } from 'cx/widgets';
import { Controller, LabelsTopLayout, LabelsTopLayoutCell } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, Chart, LineGraph, Legend } from 'cx/charts';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';
import configs from './configs/LineGraph';

class PageController extends Controller {
    onInit() {
        this.store.init("$page.pointsCount", 50);
        this.store.init("$page.showArea", true);
        this.store.init("$page.showLine", true);
        this.store.init("$page.smooth", true);
        this.store.init("$page.smoothingRatio", 0.07);


        this.addTrigger(
            "on-count-change",
            ['$page.pointsCount'],
            (cnt) => {
                var y1 = 250, y2 = 350;
                this.store.set('$page.points', Array.from({ length: cnt }, (_, i) => ({
                    x: i * 4,
                    y: i % 20 == 3 ? null : (y1 = (y1 + (Math.random() - 0.5) * 30)),
                    y2: y2 = (y2 + (Math.random() - 0.5) * 30),
                    y2l: y2 - 50,
                    y2h: y2 + 50
                })));
            },
            true
        );
    }
}

export const LineGraphs = <cx>
    <Md>
        # Line Graphs

        <ImportPath path="import {LineGraph} from 'cx/charts';" />

        Line charts are commonly used for data trends visualization.

        <CodeSplit>
            <div class="widgets" controller={PageController}>
                <Legend />
                <Svg style="width:600px; height:400px;">
                    <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis, lineStyle: "stroke: transparent" }, y: { type: NumericAxis, vertical: true } }}>
                        <Gridlines />
                        <LineGraph name="Line 2" data-bind="$page.points" colorIndex={8} yField="y2h" y0Field="y2l" active-bind="$page.line2" line={false} area-bind='$page.showArea' smooth-bind='$page.smooth' smoothingRatio-bind='$page.smoothingRatio' />
                        <LineGraph name="Line 1" data-bind="$page.points" colorIndex={0} area-bind='$page.showArea' active-bind="$page.line1" smooth-bind='$page.smooth' smoothingRatio-bind='$page.smoothingRatio' line-bind='$page.showLine' />
                        <LineGraph name="Line 2" data-bind="$page.points" colorIndex={8} yField="y2" active-bind="$page.line2" smooth-bind='$page.smooth' smoothingRatio-bind='$page.smoothingRatio' line-bind='$page.showLine' />
                    </Chart>
                </Svg>

                <LabelsTopLayout columns={4} mod='stretch'>
                    <LabelsTopLayoutCell colSpan={2}>
                        <Slider
                            label="Data points count"
                            maxValue={200}
                            minValue={5}
                            step={1}
                            value={{ bind: "$page.pointsCount", debounce: 100 }}
                            help-tpl="{$page.pointsCount} points"
                        />
                    </LabelsTopLayoutCell>
                    <Switch label="Area" value-bind="$page.showArea" />
                    <Switch label="Line" value-bind="$page.showLine" />

                    <Switch label="Smooth" value-bind="$page.smooth" style='margin-right: 20px'/>
                    <Slider
                        label="Smoothing ratio"
                        enabled-bind="$page.smooth"
                        value={{ bind: "$page.smoothingRatio", debounce: 100 }}
                        maxValue={0.4}
                        minValue={0}
                        step={0.01}
                        help-tpl="{$page.smoothingRatio:n;0;2}"
                    />
                </LabelsTopLayout>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="g33HXn2r">{`
                    class PageController extends Controller {
                        onInit() {
                            this.store.init("$page.pointsCount", 50);
                            this.store.init("$page.showArea", true);
                            this.store.init("$page.showLine", true);
                            this.store.init("$page.smooth", true);
                            this.store.init("$page.smoothingRatio", 0.07);


                            this.addTrigger(
                                "on-count-change",
                                ['$page.pointsCount'],
                                (cnt) => {
                                    var y1 = 250, y2 = 350;
                                    this.store.set('$page.points', Array.from({ length: cnt }, (_, i) => ({
                                        x: i * 4,
                                        y: i % 20 == 3 ? null : (y1 = (y1 + (Math.random() - 0.5) * 30)),
                                        y2: y2 = (y2 + (Math.random() - 0.5) * 30),
                                        y2l: y2 - 50,
                                        y2h: y2 + 50
                                    })));
                                },
                                true
                            );
                        }
                    }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="g33HXn2r">{`
                    <div class="widgets" controller={PageController}>
                        <Legend />
                        <Svg style="width:600px; height:400px;">
                            <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis, lineStyle: "stroke: transparent" }, y: { type: NumericAxis, vertical: true } }}>
                                <Gridlines />
                                <LineGraph data-bind="$page.points" colorIndex={8} yField="y2h" y0Field="y2l" active-bind="$page.line2" line={false} area-bind='$page.showArea' smooth-bind='$page.smooth' smoothingRatio-bind='$page.smoothingRatio' />
                                <LineGraph name="Line 1" data-bind="$page.points" colorIndex={0} area-bind='$page.showArea' active-bind="$page.line1" smooth-bind='$page.smooth' smoothingRatio-bind='$page.smoothingRatio' line-bind='$page.showLine' />
                                <LineGraph name="Line 2" data-bind="$page.points" colorIndex={8} yField="y2" active-bind="$page.line2" smooth-bind='$page.smooth' smoothingRatio-bind='$page.smoothingRatio' line-bind='$page.showLine' />
                            </Chart>
                        </Svg>

                        <LabelsTopLayout columns={4} mod='stretch'>
                            <LabelsTopLayoutCell colSpan={2}>
                                <Slider
                                    label="Data points count"
                                    maxValue={200}
                                    minValue={5}
                                    step={1}
                                    value={{ bind: "$page.pointsCount", debounce: 100 }}
                                    help-tpl="{$page.pointsCount} points"
                                />
                            </LabelsTopLayoutCell>
                            <Switch label="Area" value-bind="$page.showArea" />
                            <Switch label="Line" value-bind="$page.showLine" />

                            <Switch label="Smooth" value-bind="$page.smooth" style='margin-right: 20px'/>
                            <Slider
                                label="Smoothing ratio"
                                enabled-bind="$page.smooth"
                                value={{ bind: "$page.smoothingRatio", debounce: 100 }}
                                maxValue={0.4}
                                minValue={0}
                                step={0.01}
                                help-tpl="{$page.smoothingRatio:n;0;2}"
                            />
                        </LabelsTopLayout>
                    </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

      ## Examples

      * [Stacked](~/examples/charts/line/stacked)

      ## Configuration

      <ConfigTable props={configs} />

    </Md>
</cx>
