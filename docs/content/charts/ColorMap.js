import { HtmlElement, Repeater } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, Chart, LineGraph, Legend, ColorMap } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';



import configs from './configs/ColorMap';

class PageController extends Controller {
    init() {
        super.init();
        this.store.set('$page.series', Array.from({length: 5}, (_, i) => {
            var y = 100 + Math.random() * 200;
            return {
                name: 'Serie ' + (i + 1),
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

            The `ColorMap` widget is used to assign colors based on names. This comes very handy when the number
            of elements on the chart is not known upfront.

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
                                name: 'Serie ' + (i + 1),
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

