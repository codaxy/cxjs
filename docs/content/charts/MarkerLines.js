import {HtmlElement, Button} from 'cx/widgets';
import {Controller} from 'cx/ui';
import {Svg, Text} from 'cx/svg';
import {Gridlines, MarkerLine, NumericAxis, Chart, LineGraph, Legend} from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import configs from './configs/MarkerLine';

class PageController extends Controller {
    onInit() {
        this.generate();
        this.addComputable('$page.extremes', ['$page.points'], points => {
            if (points.length == 0)
                return null;
            var min = points[0].y;
            var max = points[0].y;
            for (var i = 1; i < points.length; i++) {
                if (points[i].y < min)
                    min = points[i].y;
                if (points[i].y > max)
                    max = points[i].y;
            }
            return {
                min,
                max
            }
        });
    }

    generate() {
        var y = 100;
        this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
            x: i * 4,
            y: y = y + (Math.random() - 0.5) * 30
        })));
    }
}


export const MarkerLines = <cx>
    <Md>
        <CodeSplit>
            # MarkerLine

            <ImportPath path="import {MarkerLine} from 'cx/charts';"/>

            Marker lines can be used to highlight important values such as minimum or maximum.

            <div class="widgets" controller={PageController}>
                <Svg style="width:600px; height:400px;">
                    <Chart
                        offset="20 -10 -40 40"
                        axes={{
                            x: {type: NumericAxis},
                            y: {type: NumericAxis, vertical: true, deadZone: 20}
                        }}
                    >
                        <Gridlines/>
                        <MarkerLine y:bind="$page.extremes.min" colorIndex={6}>
                            <Text anchors="0 0 0 0" offset="5 0 0 5" dy="0.8em">Min</Text>
                        </MarkerLine>
                        <MarkerLine y:bind="$page.extremes.max" colorIndex={3}>
                            <Text anchors="0 0 0 0" offset="-5 0 0 5">Max</Text>
                        </MarkerLine>
                        <LineGraph data:bind="$page.points" colorIndex={0}/>
                    </Chart>
                </Svg>
                <Legend/>
                <Button onClick="generate">
                    Generate
                </Button>
            </div>

            <CodeSnippet putInto="code" fiddle="Kc5LQhGG">{`
            class PageController extends Controller {
                onInit() {
                    this.generate();
                    this.addComputable('$page.extremes', ['$page.points'], points => {
                        if (points.length == 0)
                            return null;
                        var min = points[0].y;
                        var max = points[0].y;
                        for (var i = 1; i < points.length; i++) {
                            if (points[i].y < min)
                                min = points[i].y;
                            if (points[i].y > max)
                                max = points[i].y;
                        }
                        return {
                            min,
                            max
                        }
                    });
                }

                generate() {
                    var y = 100;
                    this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
                        x: i * 4,
                        y: y = y + (Math.random() - 0.5) * 30
                    })));
                }
            }
            ...
            <div class="widgets" controller={PageController}>
                <Svg style="width:600px; height:400px;">
                    <Chart
                        offset="20 -10 -40 40"
                        axes={{
                            x: {type: NumericAxis},
                            y: {type: NumericAxis, vertical: true, deadZone: 20}
                        }}
                    >
                        <Gridlines/>
                        <MarkerLine y:bind="$page.extremes.min" colorIndex={6}>
                            <Text anchors="0 0 0 0" offset="5 0 0 5" dy="0.8em">Min</Text>
                        </MarkerLine>
                        <MarkerLine y:bind="$page.extremes.max" colorIndex={3}>
                            <Text anchors="0 0 0 0" offset="-5 0 0 5">Max</Text>
                        </MarkerLine>
                        <LineGraph data:bind="$page.points" colorIndex={0}/>
                    </Chart>
                </Svg>
                <Legend />
                <Button onClick="generate">
                    Generate
                </Button>
            </div>
        `}</CodeSnippet>
        </CodeSplit>

        > Note how `deadZone` is used on the vertical axis to reserve space for min/max labels.

        ## Configuration

        <ConfigTable props={configs}/>

    </Md>
</cx>

