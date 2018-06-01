import {HtmlElement} from 'cx/widgets';
import {Controller, KeySelection} from 'cx/ui';
import {Svg} from 'cx/svg';
import {Gridlines, NumericAxis, CategoryAxis, Chart, ColumnGraph, Legend} from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import {casual} from 'docs/content/examples/data/casual';

import configs from './configs/ColumnGraph';

class PageController extends Controller {
    init() {
        super.init();
        var v1 = 100;
        var v2 = 110;
        this.store.init('$page.points', Array.from({length: 11}, (_, i) => ({
            x: casual.city,
            v1: v1 = (v1 + (Math.random() - 0.5) * 30),
            v2: v2 = (v2 + (Math.random() - 0.5) * 30)
        })));
    }
}


export const ColumnGraphs = <cx>
    <Md>
        <CodeSplit>
            # ColumnGraph

            <ImportPath path="import {ColumnGraph} from 'cx/charts';"/>

            The `ColumnGraph` widget is used to display a serie of vertical bars.

            <div class="widgets" controller={PageController}>
                <Legend />
                <Svg style="width:600px; height:400px;">
                    <Chart
                        offset="20 -20 -100 40"
                        axes={{
                            x: {
                                type: CategoryAxis,
                                snapToTicks: 0,
                                labelWrap: true,
                                labelOffset: 15,
                                labelRotation: -45,
                                labelDy: '0.3em',
                                labelAnchor: 'end',
                                labelLineCountDyFactor: -0.5
                            },
                            y: {
                                type: NumericAxis,
                                vertical: true,
                                snapToTicks: 1
                            }
                        }}
                    >
                        <Gridlines/>
                        <ColumnGraph
                            data:bind="$page.points"
                            colorIndex={0}
                            active:bind="$page.showV1"
                            name="V1"
                            size={0.3}
                            offset={-0.15}
                            yField="v1"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selected.x',
                                keyField: 'x'
                            }}
                            tooltip={{
                                title: 'V1',
                                text: { tpl: "{$record.v1:n;2}" },
                                trackMouse: true
                            }}

                        />

                        <ColumnGraph
                            data:bind="$page.points"
                            colorIndex={6}
                            active:bind="$page.showV2"
                            name="V2"
                            size={0.3}
                            offset={+0.15}
                            yField="v2"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selected.x',
                                keyField: 'x'
                            }}
                            tooltip={{
                                title: 'V2',
                                text: { tpl: "{$record.v2:n;2}" },
                                trackMouse: true
                            }}
                        />
                    </Chart>
                </Svg>
            </div>

            <CodeSnippet putInto="code" fiddle="m9BtpNbW">{`
            class PageController extends Controller {
                init() {
                   super.init();
                   var v1 = 100;
                   var v2 = 110;
                   this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
                      x: casual.city,
                      v1: v1 = (v1 + (Math.random() - 0.5) * 30),
                      v2: v2 = (v2 + (Math.random() - 0.5) * 30)
                   })));
                }
            }
            ...
            <div class="widgets" controller={PageController}>
               <Legend />
               <Svg style="width:600px; height:400px;">
                    <Chart
                        offset="20 -20 -100 40"
                        axes={{
                            x: {
                                type: CategoryAxis,
                                snapToTicks: 0,
                                labelWrap: true,
                                labelOffset: 15,
                                labelRotation: -45,
                                labelDy: '0.3em',
                                labelAnchor: 'end',
                                labelLineCountDyFactor: -0.5
                            },
                            y: {
                                type: NumericAxis,
                                vertical: true,
                                snapToTicks: 1
                            }
                        }}
                    >
                        <Gridlines/>
                        <ColumnGraph
                            data:bind="$page.points"
                            colorIndex={0}
                            active:bind="$page.showV1"
                            name="V1"
                            size={0.3}
                            offset={-0.15}
                            yField="v1"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selected.x',
                                keyField: 'x'
                            }}
                        />

                        <ColumnGraph
                            data:bind="$page.points"
                            colorIndex={6}
                            active:bind="$page.showV2"
                            name="V2"
                            size={0.3}
                            offset={+0.15}
                            yField="v2"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selected.x',
                                keyField: 'x'
                            }}/>
                    </Chart>
                </Svg>
            </div>
        `}</CodeSnippet>
        </CodeSplit>

        ## Examples:

        * [Timeline](~/examples/charts/bar/timeline)

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

