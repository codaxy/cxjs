import { BarGraph, CategoryAxis, Chart, Gridlines, Legend, NumericAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, KeySelection } from "cx/ui";
import { Content, Tab } from "cx/widgets";
import { CodeSnippet } from "docs/components/CodeSnippet";
import { CodeSplit } from "docs/components/CodeSplit";
import { ConfigTable } from "docs/components/ConfigTable";
import { ImportPath } from "docs/components/ImportPath";
import { Md } from "docs/components/Md";
import { casual } from "docs/content/examples/data/casual";
import configs from "./configs/BarGraph";

class PageController extends Controller {
   onInit() {
      var v1 = 100;
      var v2 = 110;
      this.store.set(
         "$page.points",
         Array.from({ length: 11 }, (_, i) => ({
            y: casual.city,
            v1: (v1 = v1 + (Math.random() - 0.5) * 30),
            v2: (v2 = v2 + (Math.random() - 0.5) * 30),
         })),
      );
   }
}

export const BarGraphs = (
   <cx>
      <Md>
         <CodeSplit>
            # BarGraph
            <ImportPath path="import {BarGraph} from 'cx/charts';" />
            The `BarGraph` widget is used to display a serie of horizontal bars.
            <div class="widgets" controller={PageController}>
               <Svg style="width:500px; height:400px;">
                  <Chart
                     offset="20 -20 -30 150"
                     axes={{
                        x: { type: NumericAxis, snapToTicks: 1 },
                        y: { type: CategoryAxis, vertical: true },
                     }}
                  >
                     <Gridlines />
                     <BarGraph
                        data-bind="$page.points"
                        colorIndex={0}
                        name="V1"
                        size={0.3}
                        offset={-0.15}
                        xField="v1"
                        borderRadius={2}
                        selection={{
                           type: KeySelection,
                           bind: "$page.selected.y",
                           keyField: "y",
                        }}
                     />

                     <BarGraph
                        data-bind="$page.points"
                        colorIndex={6}
                        name="V2"
                        size={0.3}
                        borderRadius={2}
                        offset={+0.15}
                        xField="v2"
                        selection={{
                           type: KeySelection,
                           bind: "$page.selected.y",
                           keyField: "y",
                        }}
                     />
                  </Chart>
               </Svg>
               <Legend vertical />
            </div>
            Examples: * [Scrollable Bar Charts](~/examples/charts/bar/scrollable-bars)
            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />

               <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="I9AysZCY">{`
            class PageController extends Controller {
               onInit() {
                  var v1 = 100;
                  var v2 = 110;
                  this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
                     y: casual.city,
                     v1: v1 = (v1 + (Math.random() - 0.5) * 30),
                     v2: v2 = (v2 + (Math.random() - 0.5) * 30)
                  })));
               }
            }
            `}</CodeSnippet>
               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="I9AysZCY">{`
            <div class="widgets" controller={PageController}>
               <Svg style="width:500px; height:400px;">
                  <Chart offset="20 -20 -30 150" axes={{
                     x: { type: NumericAxis, snapToTicks: 1 },
                     y: { type: CategoryAxis, vertical: true }
                  }}>
                     <Gridlines/>
                     <BarGraph data-bind="$page.points"
                                 colorIndex={0}
                                 name="V1"
                                 size={0.3}
                                 offset={-0.15}
                                 xField="v1"
                                 selection={{
                                    type: KeySelection,
                                    bind: '$page.selected.y',
                                    keyField: 'y'
                                 }}
                     />

                     <BarGraph data-bind="$page.points"
                                 colorIndex={6}
                                 name="V2"
                                 size={0.3}
                                 offset={+0.15}
                                 xField="v2"
                                 selection={{
                                    type: KeySelection,
                                    bind: '$page.selected.y',
                                    keyField: 'y'
                                 }}/>
                  </Chart>
               </Svg>
               <Legend vertical />
            </div>
            `}</CodeSnippet>
            </Content>
         </CodeSplit>
         ## Configuration
         <ConfigTable props={configs} />
      </Md>
   </cx>
);
