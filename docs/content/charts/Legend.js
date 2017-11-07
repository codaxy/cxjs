import { HtmlElement, Repeater, Text, Grid } from 'cx/widgets';
import { Controller, KeySelection } from 'cx/ui';
import { Svg, Rectangle, Line } from 'cx/svg';
import { PieChart, PieSlice, LegendEntry, ColorMap } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';



import legendConfigs from './configs/Legend';
import legendEntryConfigs from './configs/LegendEntry';

class PageController extends Controller {
    init() {
        super.init();

        this.store.set('$page.points', Array.from({length: 7}, (_, i) => ({
            id: i,
            name: 'Item ' + (i+1),
            value: 50 + Math.random() * 50
        })));
    }
}

export const LegendPage = <cx>
    <Md>
        <CodeSplit>

            # Legend

            <ImportPath path="import { Legend, LegendEntry } from 'cx/charts';" />

            The `Legend` widget is used to display an index of elements displayed on the chart.
            Please refer to
            [LineGraph](~/charts/line-graphs),
            [BarGraph](~/charts/bar-graphs) or
            [PieChart](~/charts/pie-charts)
            articles to see how legends are commonly used.

            Here we'll explain an advanced use case of a legend combined out of `LegendEntry` and `Grid` widgets.


            <div class="widgets" controller={PageController}>
                <Svg style="width:300px; height:300px;">
                    <ColorMap />
                    <PieChart angle={360}>
                        <Repeater records:bind="$page.points">
                            <PieSlice value:bind='$record.value'
                                      active:bind='$record.active'
                                      colorMap="pie"
                                      r={80}
                                      r0={20}
                                      offset={5}
                                      tooltip:tpl="{$record.name}: {$record.value:n;2}"
                                      innerPointRadius={80}
                                      outerPointRadius={90}
                                      name:bind="$record.name"
                                      selection={{
                                          type: KeySelection,
                                          bind: '$page.selection',
                                          records: {bind: '$page.points'},
                                          record: {bind: '$record'},
                                          index: {bind: '$index'},
                                          keyField: 'id'
                                      }} />
                        </Repeater>
                    </PieChart>
                </Svg>

                <Grid records:bind="$page.points"
                      style="width: 200px"
                      columns={[
                          { field: 'name', pad: false, header: "Item", items: <cx>
                              <LegendEntry name:bind="$record.name"
                                           colorMap="pie"
                                           active:bind='$record.active'
                                           selection={{
                                               type: KeySelection,
                                               bind: '$page.selection',
                                               records: {bind: '$page.points'},
                                               record: {bind: '$record'},
                                               index: {bind: '$index'},
                                               keyField: 'id'
                                           }}
                                           size={10}
                                           shape='circle'/>
                              <Text bind="$record.name" />
                            </cx>},
                          { field: 'value', header: 'Value', format: "n;2", align: "right" }
                      ]}
                      selection={{
                          type: KeySelection,
                          bind: '$page.selection',
                          keyField: 'id'
                      }}/>
            </div>





            <CodeSnippet putInto="code" lang="html" fiddle="c2Y0MiBY">{`
                // There is a performance issue with code higlighting of this snippet, so lang is set to html instead of jsx.

                class PageController extends Controller {
                    init() {
                        super.init();
                        var value = 100;
                        this.store.set('$page.points', Array.from({length: 7}, (_, i) => ({
                            id: i,
                            name: 'Item ' + (i+1),
                            value: value = (value + (Math.random() - 0.5) * 30),
                        })));
                    }
                }
                ...
                <div class="widgets" controller={PageController}>
                    <Svg style="width:300px; height:300px;">
                        <ColorMap />
                        <PieChart angle={360}>
                            <Repeater records:bind="$page.points">
                                <PieSlice value:bind='$record.value'
                                          active:bind='$record.active'
                                          colorMap="pie"
                                          r={80}
                                          r0={20}
                                          offset={5}
                                          tooltip:tpl="{$record.name}: {$record.value:n;2}"
                                          innerPointRadius={80}
                                          outerPointRadius={90}
                                          name:bind="$record.name"
                                          selection={{
                                              type: KeySelection,
                                              bind: '$page.selection',
                                              records: {bind: '$page.points'},
                                              record: {bind: '$record'},
                                              index: {bind: '$index'},
                                              keyField: 'id'
                                          }}/>
                            </Repeater>
                        </PieChart>
                    </Svg>

                     <Grid records:bind="$page.points"
                           style="width: 200px"
                           columns={[
                               { field: 'name', pad: false, header: "Item", items: <cx>
                                   <LegendEntry name:bind="$record.name"
                                                colorMap="pie"
                                                active:bind='$record.active'
                                                text:bind="$record.name"
                                                selection={{
                                                    type: KeySelection,
                                                    bind: '$page.selection',
                                                    records: {bind: '$page.points'},
                                                    record: {bind: '$record'},
                                                    index: {bind: '$index'},
                                                    keyField: 'id'
                                                }}
                                                size={10}
                                                shape='circle'/>
                                 </cx>},
                               { field: 'value', header: 'Value', format: "n;2", align: "right" }
                           ]}
                           selection={{
                               type: KeySelection,
                               bind: '$page.selection',
                               keyField: 'id'
                           }}/>
                </div>
            `}</CodeSnippet>
        </CodeSplit>

        **Note on `Legend`:** If multiple charts are rendered on the same page, use `Legend.Scope` to prevent Legends from interfering with one another, 
        as shown in this [example](https://cxjs.io/fiddle/?f=gs69CxgF). 

        ## `Legend` Configuration

        <ConfigTable props={legendConfigs} />

        ## `LegendEntry` Configuration

        <ConfigTable props={legendEntryConfigs} />

    </Md>
</cx>;

