import { HtmlElement } from 'cx/widgets';
import { Svg, Rectangle } from 'cx/svg';
import { Chart, NumericAxis, Gridlines } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import configs from './configs/NumericAxis';


export const NumericAxisPage = <cx>
    <Md>
        # Numeric Axis

        <ImportPath path="import {NumericAxis} from 'cx/charts';" />

        The `NumericAxis` widget is used to map numeric data along the horizontal or vertical axis of a chart.
        Other widgets, such as graphs, use it to calculate their position on the chart.
        On the other side axis adapts its visible range to the data being shown.
        Axis is also responsive. It selects different tick configuration based on the available space.

        <CodeSplit>

            <div class="widgets">
                <Svg style="width:400px;height:300px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <NumericAxis min={100} max={500} />,
                        y: <NumericAxis vertical max={5000} />,
                        x2: <NumericAxis secondary inverted />,
                        y2: <NumericAxis vertical secondary />
                    }}>
                        <Rectangle fill="white" margin={1}/>
                        <Gridlines />
                        <Gridlines xAxis="x2" yAxis="y2" />
                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code">{`
                <Svg style="width:400px;height:300px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <NumericAxis min={100} max={500} />,
                        y: <NumericAxis vertical max={5000} />,
                        x2: <NumericAxis secondary inverted />,
                        y2: <NumericAxis vertical secondary />
                    }}>
                        <Rectangle fill="white" margin={1}/>
                        <Gridlines />
                        <Gridlines xAxis="x2" yAxis="y2" />
                    </Chart>
                </Svg>
         `}</CodeSnippet>
        </CodeSplit>

        > Be careful with gridlines when using secondary axes.

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

