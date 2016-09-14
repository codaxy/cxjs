import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {CategoryAxis} from 'cx/ui/svg/charts/axis/CategoryAxis';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {ColumnGraph} from 'cx/ui/svg/charts/ColumnGraph';
import {Legend} from 'cx/ui/svg/charts/Legend';
import {KeySelection} from 'cx/ui/selection/KeySelection';
import {casual} from 'docs/content/examples/data/casual';

import configs from './configs/ColumnGraph';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 100;
      var v2 = 110;
      this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
         x: casual.city,
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v2 = (v2 + (Math.random() - 0.5) * 30)
      })));
   }
}


export const ColumnGraphs = <cx>
   <Md>
      <CodeSplit>
         # ColumnGraph

         The `ColumnGraph` widget is used to display a serie of vertical bars.

         <div class="widgets" controller={PageController}>
            <Legend />
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -20 -100 40" axes={{
                  x: { type: CategoryAxis, snapToTicks: 0, labelRotation: -45, labelAnchor: 'end' },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <ColumnGraph data:bind="$page.points"
                               colorIndex={0}
                               active:bind="$page.showV1"
                               name="V1"
                               size={0.3}
                               offset={-0.15}
                               yField="v1"
                               selection={{
                                  type: KeySelection,
                                  bind: '$page.selected.x',
                                  keyField: 'x'
                               }}
                  />

                  <ColumnGraph data:bind="$page.points"
                               colorIndex={6}
                               active:bind="$page.showV2"
                               name="V2"
                               size={0.3}
                               offset={+0.15}
                               yField="v2"
                               selection={{
                                  type: KeySelection,
                                  bind: '$page.selected.x',
                                  keyField: 'x'
                               }}/>
               </Chart>
            </Svg>
         </div>

         <CodeSnippet putInto="code">{`
         class PageController extends Controller {
            init() {
               super.init();
               var v1 = 100;
               var v2 = 110;
               this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
                  x: casual.city,
                  v1: v1 = (v1 + (Math.random() - 0.5) * 30),
                  v2: v2 = (v2 + (Math.random() - 0.5) * 30)
               })));
            }
         }
         ...
         <div class="widgets" controller={PageController}>
            <Legend />
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -20 -80 40" axes={{
                  x: { type: CategoryAxis, snapToTicks: 0, labelRotation: -45, labelAnchor: 'end' },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <ColumnGraph data:bind="$page.points"
                               colorIndex={0}
                               name="V1"
                               size={0.3}
                               offset={-0.15}
                               yField="v1"
                               selection={{
                                  type: KeySelection,
                                  bind: '$page.selected.x',
                                  keyField: 'x'
                               }}
                  />

                  <ColumnGraph data:bind="$page.points"
                               colorIndex={6}
                               name="V2"
                               size={0.3}
                               offset={+0.15}
                               yField="v2"
                               selection={{
                                  type: KeySelection,
                                  bind: '$page.selected.x',
                                  keyField: 'x'
                               }}/>
               </Chart>
            </Svg>
         </div>
         `}</CodeSnippet>
      </CodeSplit>

      Examples:

      * [Numeric X Axis](~/examples/charts/column/numeric)
      * [Category X Axis](~/examples/charts/column/category)

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

