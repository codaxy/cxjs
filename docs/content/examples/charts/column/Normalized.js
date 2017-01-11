import { HtmlElement, Grid, Repeater } from 'cx/widgets';
import { Controller, KeySelection } from 'cx/ui';
import { Svg, Rectangle, Text } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, Column, Legend } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';





class PageController extends Controller {
   init() {
      super.init();
      var v1 = 500;
      var v2 = 500;
      var v3 = 500;
      this.store.set('$page.points', Array.from({length: 15}, (_, i) => ({
         x: 2000 + i,
         v1: v1 = v1 + (Math.random() - 0.5) * 100,
         v2: v2 = v2 + (Math.random() - 0.5) * 100,
         v3: v3 = v3 + (Math.random() - 0.5) * 100,
      })));
   }
}

export const Normalized = <cx>
   <Md controller={PageController}>
      <CodeSplit>

         # Normalized Stacked Bar Chart

         This example shows a normalized stacked bar chart.

         <div class="widgets">
            <div>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -20 -40 40" axes={{
                        x: CategoryAxis,
                        y: { type: NumericAxis, vertical: true, normalized: true, format: 'p' }
                     }}>
                     <Repeater records:bind="$page.points" recordName="$point">
                        <Column name="V1"
                                active:bind="$page.v1"
                                colorIndex={0}
                                x:bind="$point.x"
                                y:bind="$point.v1"
                                tooltip:tpl="V1 {$point.x} {$point.v1:n}"
                                stacked />

                        <Column name="V2"
                                active:bind="$page.v2"
                                colorIndex={2}
                                x:bind="$point.x"
                                y:bind="$point.v2"
                                tooltip:tpl="V2 {$point.x} {$point.v2:n}"
                                stacked />

                        <Column name="V3"
                                active:bind="$page.v3"
                                colorIndex={4}
                                x:bind="$point.x"
                                y:bind="$point.v3"
                                tooltip:tpl="V3 {$point.x} {$point.v3:n}"
                                stacked />

                     </Repeater>
                  </Chart>
               </Svg>
               <Legend />
               </div>
         </div>

         <CodeSnippet putInto="code" fiddle="a26d4raK">{`
         class PageController extends Controller {
            init() {
               super.init();
               var v1 = 500;
               var v2 = 500;
               var v3 = 500;
               this.store.set('$page.points', Array.from({length: 10}, (_, i) => ({
                  x: 2000 + i,
                  v1: v1 = v1 + (Math.random() - 0.5) * 100,
                  v2: v2 = v2 + (Math.random() - 0.5) * 100,
                  v3: v3 = v3 + (Math.random() - 0.5) * 100,
               })));
            }
         }
         ...
         <Svg style="width:600px; height:400px;">
            <Chart offset="20 -20 -40 40" axes={{
                  x: CategoryAxis,
                  y: { type: NumericAxis, vertical: true, normalized: true, format: 'p' }
               }}>
               <Gridlines/>
               <Repeater records:bind="$page.points" recordName="$point">
                  <Column name="V1"
                          active:bind="$page.v1"
                          colorIndex={0}
                          x:bind="$point.x"
                          y:bind="$point.v1"
                          tooltip:tpl="V1 {$point.x} {$point.v1:n}"
                          stacked />

                  <Column name="V2"
                          active:bind="$page.v2"
                          colorIndex={2}
                          x:bind="$point.x"
                          y:bind="$point.v2"
                          tooltip:tpl="V2 {$point.x} {$point.v2:n}"
                          stacked />

                  <Column name="V3"
                          active:bind="$page.v3"
                          colorIndex={4}
                          x:bind="$point.x"
                          y:bind="$point.v3"
                          tooltip:tpl="V3 {$point.x} {$point.v3:n}"
                          stacked />

               </Repeater>
            </Chart>          
         </Svg>
         <Legend />
          `}</CodeSnippet>
      </CodeSplit>
   </Md>
</cx>;

