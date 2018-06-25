import {HtmlElement, Repeater, Grid} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Svg, Rectangle} from 'cx/svg';
import {Chart, NumericAxis, MouseTracker, Gridlines, LineGraph, SnapPointFinder, Marker, MarkerLine} from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';

import configs from './configs/SnapPointFinder';

class ChartController extends Controller {
    onInit() {
        let y = 200;
        this.store.set('$page.data', Array.from({length: 31}, (_, x) => ({
            x: x * 4,
            y: (y = y + Math.random() * 20 - 10)
        })));
    }
}

export const SnapPointFinderPage = <cx>
    <Md>
        # SnapPointFinder

        <ImportPath path="import {SnapPointFinder} from 'cx/charts';"/>

        <CodeSplit>

            The `SnapPointFinder` helper is used to find a point on the graph near the cursor.

            <div class="widgets">
                <Svg style="width:600px;height:500px;" margin="60 60 60 60" controller={ChartController}>
                    <Chart axes={{
                        x: <NumericAxis />,
                        y: <NumericAxis vertical min={0} max={400} />,
                    }}>
                        <MouseTracker x:bind="$page.cursor.x" y:bind="$page.cursor.y">
                            <Gridlines />
                            <SnapPointFinder
                                cursorX:bind="$page.cursor.x"
                                cursorY:bind="$page.cursor.y"
                                snapX:bind="$page.snapX"
                                snapY:bind="$page.snapY"
                                maxDistance={Infinity}
                            >
                                <LineGraph data:bind="$page.data" colorIndex={5} />
                            </SnapPointFinder>
                            <MarkerLine x:bind="$page.snapX" />
                            <Marker
                                x:bind="$page.snapX"
                                y:bind="$page.snapY"
                                colorIndex={5} size={10}
                                tooltip={{
                                    alwaysVisible: true,
                                    text: { tpl: "({$page.snapX:n;2}, {$page.snapY:n;2})"},
                                    placement: 'up',
                                    destroyDelay: 0,
                                    createDelay: 0
                                }}
                            />
                            <Marker
                                x:bind="$page.snapX"
                                y:bind="$page.cursor.y"
                                colorIndex={5} size={10}
                                tooltip={{
                                    alwaysVisible: true,
                                    text: { tpl: "({$page.snapX:n;2}, {$page.snapY:n;2})"},
                                    placement: 'up',
                                    destroyDelay: 0,
                                    createDelay: 0
                                }}
                            />
                        </MouseTracker>
                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code">{`
            class ChartController extends Controller {
                onInit() {
                    let y = 200;
                    this.store.set('$page.data', Array.from({length: 31}, (_, x) => ({
                        x: x * 4,
                        y: (y = y + Math.random() * 20 - 10)
                    })));
                }
            }
            ...
            <Svg style="width:600px;height:500px;" margin="60 60 60 60" controller={ChartController}>
                <Chart axes={{
                    x: <NumericAxis />,
                    y: <NumericAxis vertical min={0} max={400} />,
                }}>
                    <MouseTracker x:bind="$page.cursor.x" y:bind="$page.cursor.y">
                        <Gridlines />
                        <SnapPointFinder
                            cursorX:bind="$page.cursor.x"
                            cursorY:bind="$page.cursor.y"
                            snapX:bind="$page.snapX"
                            snapY:bind="$page.snapY"
                        >
                            <LineGraph data:bind="$page.data" colorIndex={5} />
                            <Marker
                                x:bind="$page.snapX"
                                y:bind="$page.snapY"
                                colorIndex={5} size={10}
                                tooltip={{
                                    alwaysVisible: true,
                                    text: { tpl: "({$page.snapX:n;2}, {$page.snapY:n;2})"},
                                    placement: 'up',
                                    destroyDelay: 0,
                                    createDelay: 0
                                }}
                            />
                        </SnapPointFinder>
                    </MouseTracker>
                </Chart>
            </Svg>
            `}</CodeSnippet>
        </CodeSplit>

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

