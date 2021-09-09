import {HtmlElement, Repeater} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Svg, Rectangle} from 'cx/svg';
import {Chart, NumericAxis, MouseTracker, Gridlines, Marker, MarkerLine, PointReducer} from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import configs from './configs/PointReducer';

class PageController extends Controller {
    onInit() {
        this.store.set('$page.points', Array.from({length: 30}, (_, i) => ({
            x: Math.random() * 300,
            y: Math.random() * 300,
            size: 10 + Math.random() * 30,
            color: Math.floor(Math.random() * 16)
        })));
    }
}

export const PointReducers = <cx>
    <Md>
        # PointReducer

        <ImportPath path="import {PointReducer} from 'cx/charts';"/>

        <CodeSplit>

            The `PointReducer` widget is used to calculate values based on points displayed on the chart.

            <div class="widgets" controller={PageController}>
                <Svg style="width:600px;height:600px;" margin="30 30 30 30">
                    <Chart axes={{
                        x: <NumericAxis min={0} max={300}/>,
                        y: <NumericAxis min={0} max={300} vertical/>,
                    }}>
                        <Gridlines />
                        <PointReducer
                            onInitAccumulator={(acc) => {
                                acc.sumX = 0;
                                acc.sumY = 0;
                                acc.sumSize = 0;
                            }}
                            onMap={(acc, x, y, name, p) => {
                                acc.sumX += x * p.size;
                                acc.sumY += y * p.size;
                                acc.sumSize += p.size;
                            }}
                            onReduce={(acc, {store}) => {
                                if (acc.sumSize > 0) {
                                    store.set('$page.avgX', acc.sumX / acc.sumSize);
                                    store.set('$page.avgY', acc.sumY / acc.sumSize);
                                }
                            }}
                        >
                            <Repeater records:bind="$page.points" recordAlias="$point">
                                <Marker colorIndex:bind="$point.color"
                                    size:bind="$point.size"
                                    x:bind="$point.x"
                                    y:bind="$point.y"
                                    style={{fillOpacity: 0.5}}
                                    draggableX draggableY
                                />
                            </Repeater>

                            <MarkerLine x:bind="$page.avgX" />
                            <MarkerLine y:bind="$page.avgY" />

                        </PointReducer>

                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code" fiddle="Yit7I9BN">{`
                <Svg style="width:600px;height:600px;" margin="30 30 30 30">
                    <Chart axes={{
                        x: <NumericAxis min={0} max={300}/>,
                        y: <NumericAxis min={0} max={300} vertical/>,
                    }}>
                        <Gridlines />
                        <PointReducer
                            onInitAccumulator={(acc) => {
                                acc.sumX = 0;
                                acc.sumY = 0;
                                acc.sumSize = 0;
                            }}
                            onMap={(acc, x, y, name, p) => {
                                acc.sumX += x * p.size;
                                acc.sumY += y * p.size;
                                acc.sumSize += p.size;
                            }}
                            onReduce={(acc, {store}) => {
                                if (acc.sumSize > 0) {
                                    store.set('$page.avgX', acc.sumX / acc.sumSize);
                                    store.set('$page.avgY', acc.sumY / acc.sumSize);
                                }
                            }}
                        >
                            <Repeater records:bind="$page.points" recordAlias="$point">
                                <Marker colorIndex:bind="$point.color"
                                    size:bind="$point.size"
                                    x:bind="$point.x"
                                    y:bind="$point.y"
                                    style={{fillOpacity: 0.5}}
                                    draggableX draggableY
                                />
                            </Repeater>

                            <MarkerLine x:bind="$page.avgX" />
                            <MarkerLine y:bind="$page.avgY" />

                        </PointReducer>

                    </Chart>
                </Svg>
            `}</CodeSnippet>

            `PointReducer` can be used as a standalone component or as one of the predefined forms:

            - [`ValueAtFinder`](~/charts/value-at-finder) - track values on line graphs
            - [`SnapPointFinder`](~/charts/snap-point-finder) - snap to data points
            - [`MinMaxFinder`](~/charts/min-max-finder) - find minimum and maximums

        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

