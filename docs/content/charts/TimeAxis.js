import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {TimeAxis} from 'cx/ui/svg/charts/axis/TimeAxis';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {ColumnGraph} from 'cx/ui/svg/charts/ColumnGraph';

import configs from './configs/TimeAxis';

class PageController extends Controller {
    init() {
        super.init();

        this.store.set('$page.data', Array.from({length: 5 * 12}, (x, i)=>({
            date: new Date(2010, i, 1),
            value: Math.random() * 1000
        })));
    }
}


export const TimeAxisPage = <cx>
    <Md>
        # Time Axis

        <CodeSplit>

            The `TimeAxis` widget is used to map date/time data along the horizontal or vertical axis of a chart.

            <div class="widgets" controller={PageController}>
                <Svg style="width:600px;height:300px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <TimeAxis />,
                        y: <NumericAxis vertical />,
                    }}>
                        <Rectangle fill="white"/>
                        <Gridlines />
                        <ColumnGraph data:bind="$page.data"
                                     size={30 * 24 * 60 * 60 * 1000}
                                     offset={15 * 24 * 60 * 60 * 1000}
                                     xField="date"
                                     yField="value" />
                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code">{`
            class PageController extends Controller {
                init() {
                    super.init();

                    this.store.set('$page.data', Array.from({length: 5 * 12}, (x, i)=>({
                        date: new Date(2010, i, 1),
                        value: Math.random() * 1000
                    })));
                }
            }
            ...
            <div class="widgets" controller={PageController}>
                <Svg style="width:600px;height:300px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <TimeAxis />,
                        y: <NumericAxis vertical />,
                    }}>
                        <Rectangle fill="white"/>
                        <Gridlines />
                        <ColumnGraph data:bind="$page.data"
                                     size={30 * 24 * 60 * 60 * 1000}
                                     offset={15 * 24 * 60 * 60 * 1000}
                                     xField="date"
                                     yField="value" />
                    </Chart>
                </Svg>
            </div>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

