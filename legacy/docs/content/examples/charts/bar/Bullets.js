import { HtmlElement, Grid, Repeater, Content, Tab } from 'cx/widgets';
import { Controller, PropertySelection } from 'cx/ui';
import { Svg, Rectangle, Text } from 'cx/svg';
import { Gridlines, Legend, NumericAxis, CategoryAxis, Chart, Bar } from 'cx/charts';
import { getComparer } from 'cx/data';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {casual} from 'docs/content/examples/data/casual';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 200;

      this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
         id: i,
         city: casual.city,
         max: v1 = 0.95 * v1,
         value: (0.5 + 0.5 * Math.random()) * v1
      })));
   }
}


export const Bullets = <cx>
   <Md controller={PageController}>
      <CodeSplit>
         # Bullet Chart Example

         This example shows how to create bullet charts out of bar charts.

         <div class="widgets">
            <div>
               <Svg style="width:600px; height:600px;">
                  <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 0 } }}>
                     <Repeater records-bind="$page.points" recordAlias="$point" sorters-bind="$page.sorters">
                        <Bar colorIndex={10}
                             style="stroke:none;opacity:0.3"
                             x-bind="$point.max"
                             y-bind="$point.city" />

                        <Bar colorIndex={8}
                             style="stroke:none;opacity:0.3"
                             x-expr="0.8*{$point.max}"
                             y-bind="$point.city" />

                        <Bar colorIndex={4}
                             style="stroke:none;opacity:0.3"
                             x-expr="0.6*{$point.max}"
                             y-bind="$point.city" />

                        <Bar style="fill:#555"
                             height={0.2}
                             x-bind="$point.value"
                             y-bind="$point.city" />

                        <Bar style="stroke:red;stroke-width:1px"
                             height={0.5}
                             x-expr="0.7*{$point.max}"
                             x0-expr="0.7*{$point.max}"
                             y-bind="$point.city" />

                     </Repeater>
                     <Gridlines yAxis={false}/>
                  </Chart>
               </Svg>
            </div>
         </div>

         <Content name="code">
            <div>
               <Tab value-bind="$page.code.tab" tab="controller" mod="code" text="Controller"/>
               <Tab value-bind="$page.code.tab" tab="chart" mod="code" default text="Chart"/>
            </div>

            <CodeSnippet fiddle="Z9CYf1Ph" visible-expr="{$page.code.tab}=='controller'">{`
         class PageController extends Controller {
            init() {
               super.init();
               var v1 = 200;

               this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
                  id: i,
                  city: casual.city,
                  max: v1 = 0.95 * v1,
                  value: (0.5 + 0.5 * Math.random()) * v1
               })));
            }
         }
        `}</CodeSnippet>
        <CodeSnippet fiddle="Z9CYf1Ph" visible-expr="{$page.code.tab}=='chart'">{`
          <Svg style="width:600px; height:600px;">
               <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 0 } }}>
                  <Repeater records-bind="$page.points" recordAlias="$point" sorters-bind="$page.sorters">
                     <Bar colorIndex={10}
                          style="stroke:none;opacity:0.3"
                          x-bind="$point.max"
                          y-bind="$point.city" />

                     <Bar colorIndex={8}
                          style="stroke:none;opacity:0.3"
                          x-expr="0.8*{$point.max}"
                          y-bind="$point.city" />

                     <Bar colorIndex={4}
                          style="stroke:none;opacity:0.3"
                          x-expr="0.6*{$point.max}"
                          y-bind="$point.city" />

                     <Bar style="fill:#555"
                          height={0.2}
                          x-bind="$point.value"
                          y-bind="$point.city" />

                     <Bar style="stroke:red;stroke-width:1px"
                          height={0.5}
                          x-expr="0.7*{$point.max}"
                          x0-expr="0.7*{$point.max}"
                          y-bind="$point.city" />

                  </Repeater>
                  <Gridlines yAxis={false}/>
               </Chart>
            </Svg>
         `}</CodeSnippet>
         </Content>
      </CodeSplit>
   </Md>
</cx>;



