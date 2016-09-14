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
                     <Repeater records:bind="$page.points" recordName="$point" sorters:bind="$page.sorters">
                        <Bar colorIndex={10}
                             style="stroke:none;opacity:0.3"
                             x:bind="$point.max"
                             y:bind="$point.city" />

                        <Bar colorIndex={8}
                             style="stroke:none;opacity:0.3"
                             x:expr="0.8*{$point.max}"
                             y:bind="$point.city" />

                        <Bar colorIndex={4}
                             style="stroke:none;opacity:0.3"
                             x:expr="0.6*{$point.max}"
                             y:bind="$point.city" />

                        <Bar style="fill:#555"
                             height={0.2}
                             x:bind="$point.value"
                             y:bind="$point.city" />

                        <Bar style="stroke:red;stroke-width:1px"
                             height={0.5}
                             x:expr="0.7*{$point.max}"
                             x0:expr="0.7*{$point.max}"
                             y:bind="$point.city" />

                     </Repeater>
                     <Gridlines yAxis={false}/>
                  </Chart>
               </Svg>
            </div>
         </div>

         <CodeSnippet putInto="code">{`
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
         ...
          <Svg style="width:600px; height:600px;">
               <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 0 } }}>
                  <Repeater records:bind="$page.points" recordName="$point" sorters:bind="$page.sorters">
                     <Bar colorIndex={10}
                          style="stroke:none;opacity:0.3"
                          x:bind="$point.max"
                          y:bind="$point.city" />

                     <Bar colorIndex={8}
                          style="stroke:none;opacity:0.3"
                          x:expr="0.8*{$point.max}"
                          y:bind="$point.city" />

                     <Bar colorIndex={4}
                          style="stroke:none;opacity:0.3"
                          x:expr="0.6*{$point.max}"
                          y:bind="$point.city" />

                     <Bar style="fill:#555"
                          height={0.2}
                          x:bind="$point.value"
                          y:bind="$point.city" />

                     <Bar style="stroke:red;stroke-width:1px"
                          height={0.5}
                          x:expr="0.7*{$point.max}"
                          x0:expr="0.7*{$point.max}"
                          y:bind="$point.city" />

                  </Repeater>
                  <Gridlines yAxis={false}/>
               </Chart>
            </Svg>
         `}</CodeSnippet>
      </CodeSplit>
   </Md>
</cx>;



