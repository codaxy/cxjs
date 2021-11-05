import { HtmlElement, Grid, Repeater, Content, Tab } from 'cx/widgets';
import { Controller, PropertySelection } from 'cx/ui';
import { Svg, Rectangle, Text } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, Bar } from 'cx/charts';
import { getComparer } from 'cx/data';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {casual} from 'docs/content/examples/data/casual';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 100;

      this.store.init('$page.points', Array.from({length: 12}, (_, i) => ({
         id: i,
         city: casual.city,
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v1 + 50 + Math.random() * 100,
         v3: v1 + 50 + Math.random() * 100,
         selected: false
      })));
   }
}

var barSelection = new PropertySelection({
   keyField: 'id',
   bind: '$page.selection',
   record: { bind: '$point' },
   index: { bind: '$index' },
   records: { bind: '$page.points' }
});

var legendStyle = "border-width:1px;border-style:solid;display:inline-block;width:20px;height:10px;";

export const Combination = <cx>
   <Md controller={PageController}>
      <CodeSplit>

         # Bar Chart Example

         This example shows how to connect grid and chart. Sorting and selection in the grid is applied to the chart too.

         <div class="widgets">
            <div>
               <Svg style="width:600px; height:600px;">
                  <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 1 } }}>
                     <Gridlines/>
                     <Repeater records:bind="$page.points" recordAlias="$point" sorters:bind="$page.sorters">
                        <Bar colorIndex={0}
                             height={0.2}
                             offset={-0.2}
                             x:bind="$point.v1"
                             y:bind="$point.city"
                             selection={barSelection}
                             tooltip-tpl="{$point.v1:n;0}" />

                        <Bar colorIndex={2}
                             height={0.2}
                             offset={0}
                             x:bind="$point.v2"
                             y:bind="$point.city"
                             selection={barSelection}
                             tooltip-tpl="{$point.v2:n;0}" />

                        <Bar colorIndex={4}
                             height={0.2}
                             offset={0.2}
                             x:bind="$point.v3"
                             y:bind="$point.city"
                             selection={barSelection}
                             tooltip-tpl="{$point.v3:n;0}" />
                     </Repeater>
                  </Chart>
               </Svg>
               <Grid records:bind="$page.points"
                     sorters:bind="$page.sorters"
                     columns={[
                        { header: 'City', field: 'city', sortable: true },
                        { field: 'v1', format: 'n;2', align: "right", sortable: true,
                           header: {
                              items: <cx>
                                 <div preserveWhitespace>
                                    V1
                                    <div class="cxs-color-0" style={legendStyle}></div>
                                 </div>
                              </cx>
                           }
                        },
                        { field: 'v2', format: 'n;2', align: "right", sortable: true,
                           header: {
                              items: <cx>
                                 <div preserveWhitespace>
                                     V2
                                     <div class="cxs-color-2" style={legendStyle}></div>
                                 </div>
                              </cx>
                           }
                        },
                        { field: 'v3', format: 'n;2', align: "right", sortable: true,
                           header: {
                           items: <cx>
                              <div preserveWhitespace>
                                  V3
                                  <div class="cxs-color-4" style={legendStyle}></div>
                              </div>
                           </cx>
                           }
                        }
                     ]}
                     selection={{type: PropertySelection, keyField: 'id', bind: '$page.selection' }}/>
            </div>
         </div>

         <Content name="code">
            <div>
               <Tab value-bind="$page.code.tab" tab="controller" mod="code"><code>Controller</code></Tab>
               <Tab value-bind="$page.code.tab" tab="chart" mod="code" default><code>Chart</code></Tab>
            </div>

            <CodeSnippet fiddle="mQSxhSAU" visible-expr="{$page.code.tab}=='controller'">{`
         class PageController extends Controller {
            init() {
               super.init();
               var v1 = 100;

               this.store.init('$page.points', Array.from({length: 12}, (_, i) => ({
                  id: i,
                  city: casual.city,
                  v1: v1 = (v1 + (Math.random() - 0.5) * 30),
                  v2: v1 + 50 + Math.random() * 100,
                  v3: v1 + 50 + Math.random() * 100,
                  selected: false
               })));
            }
         }

         var barSelection = new PropertySelection({
            keyField: 'id',
            bind: '$page.selection',
            record: { bind: '$point' },
            index: { bind: '$index' },
            records: { bind: '$page.points' }
         });
         `}</CodeSnippet>
         <CodeSnippet fiddle="mQSxhSAU" visible-expr="{$page.code.tab}=='chart'">{`
         var legendStyle = "border-width:1px;border-style:solid;display:inline-block;width:20px;height:10px;";
         <Svg style="width:600px; height:600px;">
            <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 1 } }}>
               <Gridlines/>
               <Repeater records:bind="$page.points" recordAlias="$point" sorters:bind="$page.sorters">
                  <Bar colorIndex={0}
                       height={0.2}
                       offset={-0.2}
                       x:bind="$point.v1"
                       y:bind="$point.city"
                       selection={barSelection}
                       tooltip-tpl="{$point.v1:n;0}" />

                  <Bar colorIndex={2}
                       height={0.2}
                       offset={0}
                       x:bind="$point.v2"
                       y:bind="$point.city"
                       selection={barSelection}
                       tooltip-tpl="{$point.v2:n;0}" />

                  <Bar colorIndex={4}
                       height={0.2}
                       offset={0.2}
                       x:bind="$point.v3"
                       y:bind="$point.city"
                       selection={barSelection}
                       tooltip-tpl="{$point.v3:n;0}" />
               </Repeater>
            </Chart>
         </Svg>
         <Grid records:bind="$page.points"
               sorters:bind="$page.sorters"
               columns={[
                  { header: 'City', field: 'city', sortable: true },
                  { field: 'v1', format: 'n;2', align: "right", sortable: true,
                     header: {
                        items: <cx>
                           <div preserveWhitespace>
                              V1
                              <div class="cxs-color-0" style={legendStyle}></div>
                           </div>
                        </cx>
                     }
                  },
                  { field: 'v2', format: 'n;2', align: "right", sortable: true,
                     header: {
                        items: <cx>
                           <div preserveWhitespace>
                               V2
                               <div class="cxs-color-2" style={legendStyle}></div>
                           </div>
                        </cx>
                     }
                  },
                  { field: 'v3', format: 'n;2', align: "right", sortable: true,
                     header: {
                     items: <cx>
                        <div preserveWhitespace>
                            V3
                            <div class="cxs-color-4" style={legendStyle}></div>
                        </div>
                     </cx>
                     }
                  }
               ]}
               selection={{type: PropertySelection, keyField: 'id', bind: '$page.selection' }}/>
         `}</CodeSnippet>
         </Content>
      </CodeSplit>
   </Md>
</cx>;

