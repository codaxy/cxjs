import {HtmlElement, Repeater, Grid, Content, Tab} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Svg, Rectangle} from 'cx/svg';
import {Chart, NumericAxis, MouseTracker, Gridlines, LineGraph, ValueAtFinder, MinMaxFinder, Range} from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';

import configs from './configs/MinMaxFinder';

class ChartController extends Controller {
    onInit() {
        let y = 100;
        this.store.set('$page.data', Array.from({length: 101}, (_, x) => ({
            x: x * 4,
            y: (y = y + Math.random() * 50 - 25)
        })));
    }
}

export const MinMaxFinderPage = <cx>
    <Md>
        # MinMaxFinder

        <ImportPath path="import {MinMaxFinder} from 'cx/charts';"/>

        The `MinMaxFinder` widget is a helper used to determine min and/or max values displayed on a graph.

        <CodeSplit>
            <div class="widgets">
                <Svg style="width:600px;height:500px;" margin="60 60 60 60" controller={ChartController}>
                    <Chart axes={{
                        x: <NumericAxis />,
                        y: <NumericAxis vertical/>,
                    }}>
                        <Gridlines />
                        <MinMaxFinder minY-bind="$page.min" maxY-bind="$page.max">
                            <Range y1-bind="$page.min" y2-bind="$page.max" colorIndex={5} />
                            <LineGraph data-bind="$page.data" colorIndex={5} />
                        </MinMaxFinder>
                    </Chart>
                </Svg>
            </div>

            <Content name="code">
                <Tab value-bind="$page.code.tab" tab="controller" mod="code">
                    <code>Grid</code>
                </Tab>
                <Tab value-bind="$page.code.tab" tab="chart" mod="code" default>
                    <code>Chart</code>
                </Tab>
                <CodeSnippet  fiddle="rKnjVn5i" visible-expr="{$page.code.tab}=='controller'">{`
                class ChartController extends Controller {
                    onInit() {
                        let y = 100;
                        this.store.set('$page.data', Array.from({length: 101}, (_, x) => ({
                            x: x * 4,
                            y: (y = y + Math.random() * 50 - 25)
                        })));
                    }
                }
                `}</CodeSnippet>
                <CodeSnippet  fiddle="rKnjVn5i" visible-expr="{$page.code.tab}=='chart'">{`
                <Svg style="width:600px;height:500px;" margin="60 60 60 60" controller={ChartController}>
                    <Chart axes={{
                        x: <NumericAxis />,
                        y: <NumericAxis vertical/>,
                    }}>
                        <Gridlines />
                        <MinMaxFinder minY-bind="$page.min" maxY-bind="$page.max">
                            <Range y1-bind="$page.min" y2-bind="$page.max" colorIndex={5} />
                            <LineGraph data-bind="$page.data" colorIndex={5} />
                        </MinMaxFinder>
                    </Chart>
                </Svg>
                `}</CodeSnippet>
            </Content>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

