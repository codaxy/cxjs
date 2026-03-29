import { Bar, CategoryAxis, Chart, Gridlines, NumericAxis, TimeAxis } from "cx/charts";
import { Svg } from "cx/svg";
import { Controller, LabelsTopLayout, bind, computable, tpl } from "cx/ui";
import { Content, Repeater, Slider, Tab } from "cx/widgets";
import { CodeSnippet } from "docs/components/CodeSnippet";
import { CodeSplit } from "docs/components/CodeSplit";
import { Md } from "docs/components/Md";
import { casual } from "docs/content/examples/data/casual";

class PageController extends Controller {
   onInit() {
      this.store.init("$page.itemCount", 5);
      this.addComputable("$page.points", ["$page.itemCount"], (itemCount) => {
         let names = {};
         for (let i = 0; i < itemCount; i++) {
            let name = casual.continent;
            names[name] = 1 + (names[name] ?? 0);
         }
         return Object.keys(names).map((name) => ({ name, count: names[name] }));
      });
   }
}

export const CalculatedHeight = (
   <cx>
      <Md controller={PageController}>
         <CodeSplit>
            # Calculated Height 

            Use computed value to calculate the height of the chart based on the number of
            categories.

            <div class="widgets flex-col">
               <LabelsTopLayout style="align-self: self">
                  <Slider
                     value={{
                        bind: "$page.itemCount",
                        debounce: 100,
                     }}
                     help={tpl("{$page.itemCount}")}
                     minValue={1}
                     maxValue={100}
                     step={1}
                     label="Item Count"
                  />
               </LabelsTopLayout>
               <Svg
                  style={{
                     width: "600px",
                     height: computable("$page.categoryCount", (count) => (count ?? 1) * 50 + 60),
                  }}
               >
                  <Chart
                     offset="20 -20 -40 120"
                     axes={{
                        y: {
                           type: CategoryAxis,
                           vertical: true,
                           inverted: true,
                           categoryCount: bind("$page.categoryCount"),
                        },
                        x: {
                           type: NumericAxis,
                           minLabelTickSize: 1,
                        },
                     }}
                  >
                     <Repeater records-bind="$page.points" recordAlias="$point" sortField="count" sortDirection="DESC">
                        <Bar colorIndex={6} x-bind="$point.count" y-bind="$point.name" size={0.5} />
                     </Repeater>
                     <Gridlines />
                  </Chart>
               </Svg>
            </div>
            <Content name="code">
               <div>
                  <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller" />
                  <Tab value-bind="$page.code.tab" tab="chart" mod="code" default text="Chart" />
               </div>

               <CodeSnippet fiddle="2PLnMs8F" visible-expr="{$page.code.tab}=='controller'">{`
                  class PageController extends Controller {
                     onInit() {
                        this.store.init("$page.itemCount", 5);
                        this.addComputable("$page.points", ["$page.itemCount"], (itemCount) => {
                           let names = {};
                           for (let i = 0; i < itemCount; i++) {
                              let name = casual.continent;
                              names[name] = 1 + (names[name] ?? 0);
                           }
                           return Object.keys(names).map((name) => ({ name, count: names[name] }));
                        });
                     }
                  }`}</CodeSnippet>
               <CodeSnippet fiddle="2PLnMs8F" visible-expr="{$page.code.tab}=='chart'">{`
                  <Svg
                  style={{
                     width: "600px",
                     height: computable("$page.categoryCount", (count) => (count ?? 1) * 50 + 60),
                  }}
               >
                  <Chart
                     offset="20 -20 -40 120"
                     axes={{
                        y: {
                           type: CategoryAxis,
                           vertical: true,
                           inverted: true,
                           categoryCount: bind("$page.categoryCount"),
                        },
                        x: {
                           type: NumericAxis,
                           minLabelTickSize: 1,
                        },
                     }}
                  >
                     <Repeater records-bind="$page.points" recordAlias="$point" sortField="count" sortDirection="DESC">
                        <Bar colorIndex={6} x-bind="$point.count" y-bind="$point.name" size={0.5} />
                     </Repeater>
                     <Gridlines />
                  </Chart>
               </Svg>`}</CodeSnippet>
            </Content>
         </CodeSplit>
      </Md>
   </cx>
);
