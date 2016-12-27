import { HtmlElement, Repeater } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, Chart, LineGraph, Legend, ColorMap } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import configs from './configs/ColorMap';

class PageController extends Controller {
    init() {
        super.init();
        this.store.set('$page.series', Array.from({length: 5}, (_, i) => {
            var y = 100 + Math.random() * 200;
            return {
                name: 'Series ' + (i + 1),
                active: true,
                points: Array.from({length: 26}, (_, x)=>({
                    x: x * 4,
                    y: (y = y + Math.random() * 100 - 50)
                }))
            }
        }));
    }
}

export const ColorMapPage = <cx>
    <Md>
        <CodeSplit>

            # ColorMap

            <ImportPath path="import {ColorMap} from 'cx/charts';" />

            The `ColorMap` widget is used to assign a different color to each chart element (e.g. LineGraph) from the predefined color map. 
            This comes in very handy when the number of elements on the chart is variable.
            
            `ColorMap` assigns a different color to every chart element with the same `colorMap` attribute. 
            At the same time, it will keep the maximum distance between used colors.

            <div class="widgets" controller={PageController}>
                <Svg style="width:600px; height:400px;">
                    <Chart offset="20 -10 -40 40"
                           axes={{
                               x: {type: NumericAxis},
                               y: {type: NumericAxis, vertical: true}
                           }}>
                        <Gridlines/>
                        <ColorMap />
                        
                        <Repeater records:bind="$page.series">
                            <LineGraph name:bind="$record.name"
                                active:bind="$record.active"
                                data:bind="$record.points"
                                colorMap="lines" />
                        </Repeater>
                    </Chart>
                </Svg>
                <Legend />
            </div>

            <CodeSnippet putInto="code">{`
                class PageController extends Controller {
                    init() {
                        super.init();
                        this.store.set('$page.series', Array.from({length: 5}, (_, i) => {
                            var y = 100 + Math.random() * 200;
                            return {
                                name: 'Series ' + (i + 1),
                                active: true,
                                points: Array.from({length: 26}, (_, x)=>({
                                    x: x * 4,
                                    y: (y = y + Math.random() * 100 - 50)
                                }))
                            }
                        }));
                    }
                }
                ...
                <div class="widgets" controller={PageController}>
                    <Svg style="width:600px; height:400px;">
                        <Chart offset="20 -10 -40 40"
                               axes={{
                                   x: {type: NumericAxis},
                                   y: {type: NumericAxis, vertical: true}
                               }}>
                            <Gridlines/>
                            <ColorMap />
                            <Repeater records:bind="$page.series">
                                <LineGraph name:bind="$record.name"
                                           active:bind="$record.active"
                                           data:bind="$record.points"
                                           colorMap="lines" />
                            </Repeater>
                        </Chart>
                    </Svg>
                    <Legend />
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        {/*## Configuration*/}

        {/*<ConfigTable props={configs}/>*/}

    </Md>
</cx>

