import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';
import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {Legend} from 'cx/ui/svg/charts/Legend';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {CategoryAxis} from 'cx/ui/svg/charts/axis/CategoryAxis';
import {Grid} from 'cx/ui/grid/Grid';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Bar} from 'cx/ui/svg/charts/series/Bar';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Text} from 'cx/ui/svg/Text';
import {Repeater} from 'cx/ui/Repeater';
import {PropertySelection} from 'cx/ui/selection/PropertySelection';
import {getComparer} from 'cx/data/comparer';
import {casual} from 'docs/content/examples/data/casual';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 200;
      var w1 = 200;

      this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
         id: i,
         city: casual.city,
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v1 + 50 + Math.random() * 100,
         v3: v1 + 50 + Math.random() * 100,
         w1: -(w1 = (w1 + (Math.random() - 0.5) * 30)),
         w2: -(w1 + 50 + Math.random() * 100),
         w3: -(w1 + 50 + Math.random() * 100),
      })));
   }
}


export const Stacked = <cx>
   <Md controller={PageController}>
      <CodeSplit>
         # Bar Chart Example

         This example shows how to create stacked bar charts.

         <div class="widgets">
            <div>
               <Svg style="width:600px; height:600px;">
                  <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 0 } }}>
                     <Gridlines/>
                     <Repeater records:bind="$page.points" recordName="$point" sorters:bind="$page.sorters">

                        <Bar name="V1"
                             colorIndex={8}
                             active:bind="$page.v1"
                             height={0.5}
                             x:bind="$point.v1"
                             y:bind="$point.city"
                             stacked
                             tooltip:tpl="{$point.v1:n;0}" />

                        <Bar name="V2"
                             colorIndex={9}
                             active:bind="$page.v2"
                             height={0.5}
                             x:bind="$point.v2"
                             y:bind="$point.city"
                             stacked
                             tooltip:tpl="{$point.v2:n;0}" />


                        <Bar name="V3"
                             colorIndex={10}
                             active:bind="$page.v3"
                             height={0.5}
                             x:bind="$point.v3"
                             y:bind="$point.city"
                             stacked
                             tooltip:tpl="{$point.v3:n;0}" />
                        

                        <Bar name="W1"
                             colorIndex={2}
                             active:bind="$page.w1"
                             height={0.5}
                             x:bind="$point.w1"
                             y:bind="$point.city"
                             stacked
                             stack="left"
                             tooltip:tpl="{$point.w1:n;0}" />

                        <Bar name="W2"
                             colorIndex={1}
                             active:bind="$page.w2"
                             height={0.5}
                             x:bind="$point.w2"
                             y:bind="$point.city"
                             stacked
                             stack="left"
                             tooltip:tpl="{$point.w2:n;0}" />

                        <Bar name="W3"
                             colorIndex={0}
                             active:bind="$page.w3"
                             height={0.5}
                             x:bind="$point.w3"
                             y:bind="$point.city"
                             stacked
                             stack="left"
                             tooltip:tpl="{$point.w3:n;0}" />
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
                  var v1 = 200;
                  var w1 = 200;

                  this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
                     id: i,
                     city: casual.city,
                     v1: v1 = (v1 + (Math.random() - 0.5) * 30),
                     v2: v1 + 50 + Math.random() * 100,
                     v3: v1 + 50 + Math.random() * 100,
                     w1: -(w1 = (w1 + (Math.random() - 0.5) * 30)),
                     w2: -(w1 + 50 + Math.random() * 100),
                     w3: -(w1 + 50 + Math.random() * 100),
                  })));
               }
            }
            ...
            <Svg style="width:600px; height:600px;">
               <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 0 } }}>
                  <Gridlines/>
                  <Repeater records:bind="$page.points" recordName="$point" sorters:bind="$page.sorters">

                     <Bar name="V1"
                          colorIndex={8}
                          active:bind="$page.v1"
                          height={0.5}
                          x:bind="$point.v1"
                          y:bind="$point.city"
                          stacked
                          tooltip:tpl="{$point.v1:n;0}" />

                     <Bar name="V2"
                          colorIndex={9}
                          active:bind="$page.v2"
                          height={0.5}
                          x:bind="$point.v2"
                          y:bind="$point.city"
                          stacked
                          tooltip:tpl="{$point.v2:n;0}" />


                     <Bar name="V3"
                          colorIndex={10}
                          active:bind="$page.v3"
                          height={0.5}
                          x:bind="$point.v3"
                          y:bind="$point.city"
                          stacked
                          tooltip:tpl="{$point.v3:n;0}" />


                     <Bar name="W1"
                          colorIndex={2}
                          active:bind="$page.w1"
                          height={0.5}
                          x:bind="$point.w1"
                          y:bind="$point.city"
                          stacked
                          stack="left"
                          tooltip:tpl="{$point.w1:n;0}" />

                     <Bar name="W2"
                          colorIndex={1}
                          active:bind="$page.w2"
                          height={0.5}
                          x:bind="$point.w2"
                          y:bind="$point.city"
                          stacked
                          stack="left"
                          tooltip:tpl="{$point.w2:n;0}" />

                     <Bar name="W3"
                          colorIndex={0}
                          active:bind="$page.w3"
                          height={0.5}
                          x:bind="$point.w3"
                          y:bind="$point.city"
                          stacked
                          stack="left"
                          tooltip:tpl="{$point.w3:n;0}" />
                  </Repeater>
               </Chart>
            </Svg>
            <Legend />
         `}</CodeSnippet>
      </CodeSplit>
   </Md>
</cx>;



