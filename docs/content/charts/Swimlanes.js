import { BarGraph, CategoryAxis, Chart, Legend, NumericAxis, Swimlanes } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, KeySelection } from "cx/ui";
import { Content, Tab } from "cx/widgets";
import { ImportPath } from "docs/components/ImportPath";
import { CodeSnippet } from "../../components/CodeSnippet";
import { CodeSplit } from "../../components/CodeSplit";
import { Md } from "../../components/Md";
import { casual } from "../examples/data/casual";
import { ConfigTable } from "../../components/ConfigTable";

import configs from "./configs/Swimlanes";

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

export const SwimlanesPage = (
   <cx>
      <Md>
         # Swimlanes
         <ImportPath path="import {Swimlanes} from 'cx/charts';" />
         The `Swimlanes` widget is used to draw horizontal and vertical swimlanes, usually in the chart backgrounds.
         Beside aesthetics, swimlanes make it easier to read axis values.
         <CodeSplit>
            <div class="widgets" controller={PageController}>
               <Svg style="width:500px; height:400px;">
                  <Chart
                     offset="20 -20 -30 150"
                     axes={{
                        x: { type: NumericAxis, snapToTicks: 1 },
                        y: { type: CategoryAxis, vertical: true },
                     }}
                  >
                     <Swimlanes size={0.6} step={1} />
                     <BarGraph
                        data-bind="$page.points"
                        colorIndex={0}
                        name="V1"
                        size={0.3}
                        offset={-0.15}
                        xField="v1"
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
            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />

               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="PAiR9Bc5">{`
                 <div class="widgets" controller={PageController}>
                     <Svg style="width:500px; height:400px;">
                        <Chart
                           offset="20 -20 -30 150"
                           axes={{
                              x: { type: NumericAxis, snapToTicks: 1 },
                              y: { type: CategoryAxis, vertical: true },
                           }}
                        >
                           <Swimlanes size={0.6} step={1} />
                           <BarGraph
                              data-bind="$page.points"
                              colorIndex={0}
                              name="V1"
                              size={0.3}
                              offset={-0.15}
                              xField="v1"
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
            `}</CodeSnippet>
            </Content>
         </CodeSplit>
         ## Configuration
         <ConfigTable props={configs} />
      </Md>
   </cx>
);
