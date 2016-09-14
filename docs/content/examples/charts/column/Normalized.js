import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {CategoryAxis} from 'cx/ui/svg/charts/axis/CategoryAxis';
import {Grid} from 'cx/ui/grid/Grid';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Column} from 'cx/ui/svg/charts/series/Column';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Text} from 'cx/ui/svg/Text';
import {Repeater} from 'cx/ui/Repeater';
import {KeySelection} from 'cx/ui/selection/KeySelection';
import {Legend} from 'cx/ui/svg/charts/Legend';



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

         <CodeSnippet putInto="code">{`
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
          `}</CodeSnippet>
      </CodeSplit>
   </Md>
</cx>;

