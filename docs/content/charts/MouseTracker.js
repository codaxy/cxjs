import {Content, HtmlElement, Tab} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Svg, Rectangle} from 'cx/svg';
import {Chart, NumericAxis, MouseTracker, Gridlines, Marker, MarkerLine} from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';

import configs from './configs/MouseTracker';

export const MouseTrackerPage = <cx>
    <Md>
        # MouseTracker

        <ImportPath path="import {MouseTracker} from 'cx/charts';"/>

        <CodeSplit>

            The `MouseTracker` widget is used to track mouse position on the chart.

            <div class="widgets">
                <Svg style="width:600px;height:500px;" margin="60 60 60 60">
                    <Chart axes={{
                        x: <NumericAxis min={0} max={100}/>,
                        y: <NumericAxis min={0} max={100} vertical/>,
                    }}>
                        <Gridlines />
                        <MouseTracker
                            x-bind="$page.cursor.x"
                            y-bind="$page.cursor.y"
                            tooltip={{
                                destroyDelay: 5,
                                createDelay: 5,
                                text: {tpl: "({$page.cursor.x:n;1}, {$page.cursor.y:n;1})" },
                                trackMouse: true
                            }}
                        >
                            <MarkerLine visible-expr="!!{$page.cursor}" x-bind="$page.cursor.x" y2-bind="$page.cursor.y" y1={0}/>
                            <MarkerLine visible-expr="!!{$page.cursor}" y-bind="$page.cursor.y" x2-bind="$page.cursor.x"/>
                            <Marker
                                visible-expr="!!{$page.cursor}"
                                x-bind="$page.cursor.x"
                                y-bind="$page.cursor.y"
                                size={10}
                            />
                        </MouseTracker>
                    </Chart>
                </Svg>
            </div>
            <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
                <CodeSnippet  fiddle="mpP7bCxe">{`
                    <Svg style="width:600px;height:500px;" margin="60 60 60 60">
                        <Chart axes={{
                            x: <NumericAxis min={0} max={100} />,
                            y: <NumericAxis min={0} max={100} vertical/>,
                        }}>
                            <Gridlines />
                            <MouseTracker x-bind="$page.cursor.x" y-bind="$page.cursor.y">
                                <Marker visible-expr="!!{$page.cursor}" x-bind="$page.cursor.x" y-bind="$page.cursor.y" size={10}/>
                                <MarkerLine visible-expr="!!{$page.cursor}" x-bind="$page.cursor.x" y2-bind="$page.cursor.y" y1={0}/>
                                <MarkerLine visible-expr="!!{$page.cursor}" y-bind="$page.cursor.y" x2-bind="$page.cursor.x"/>
                            </MouseTracker>
                        </Chart>
                    </Svg>
                `}</CodeSnippet>
            </Content>

            `MouseTracker` is commonly used with [point reducers](~/charts/point-reducers) to track values the graph.
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

