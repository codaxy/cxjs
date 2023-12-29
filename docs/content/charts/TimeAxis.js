import { Content, Tab } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg, Rectangle } from 'cx/svg';
import { Chart, NumericAxis, TimeAxis, Gridlines, ColumnGraph } from 'cx/charts';
import { Md } from '../../components/Md';
import { CodeSplit } from '../../components/CodeSplit';
import { CodeSnippet } from '../../components/CodeSnippet';
import { ConfigTable } from '../../components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';
import configs from './configs/TimeAxis';

class PageController extends Controller {
    onInit() {
        this.store.set('$page.data', Array.from({length: 5 * 12}, (x, i)=>({
            date: new Date(2010, i, 1),
            value: Math.random() * 1000
        })));
    }
}

export const TimeAxisPage = <cx>
    <Md>
        # Time Axis

        <ImportPath path="import {TimeAxis} from 'cx/charts';" />

        <CodeSplit>
            The `TimeAxis` widget is used to map date/time data along the horizontal or vertical axis of a chart.

            <div class="widgets" controller={PageController}>
                <Svg style="width:600px;height:300px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <TimeAxis />,
                        y: <NumericAxis vertical />,
                    }}>
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
            </div>
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>

                <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="B8fcC7VF">{`
                class PageController extends Controller {
                    onInit() {
                        this.store.set('$page.data', Array.from({length: 5 * 12}, (x, i)=>({
                            date: new Date(2010, i, 1),
                            value: Math.random() * 1000
                        })));
                    }
                }
                `}</CodeSnippet>
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="B8fcC7VF">{`
                <div class="widgets" controller={PageController}>
                    <Svg style="width:600px;height:300px;" margin="60 60 60 60">
                        <Chart axes={{
                            x: <TimeAxis />,
                            y: <NumericAxis vertical />,
                        }}>
                            <Rectangle fill="white"/>
                            <Gridlines />
                            <ColumnGraph data-bind="$page.data"
                                        size={30 * 24 * 60 * 60 * 1000}
                                        offset={15 * 24 * 60 * 60 * 1000}
                                        xField="date"
                                        yField="value" />
                        </Chart>
                    </Svg>
                </div>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Examples

        * [Complex Labels](~/examples/charts/axis/complex-labels)

        ## Configuration

        <ConfigTable props={configs}/>
    </Md>
</cx>
