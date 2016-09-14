import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';
import {casual} from 'docs/content/examples/data/casual';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';
import {Repeater} from 'cx/ui/Repeater';

import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {CategoryAxis} from 'cx/ui/svg/charts/axis/CategoryAxis';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Bar} from 'cx/ui/svg/charts/series/Bar';
import {Legend} from 'cx/ui/svg/charts/Legend';

import configs from './configs/Bar';

class PageController extends Controller {
   init() {
      super.init();
      this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
         key: casual.city,
         v1: 100 + Math.random() * 300,
         v2: 100 + Math.random() * 400
      })));
   }
}

export const Bars = <cx>
   <Md>
      <CodeSplit>

         # Bar

         Bar charts are commonly used to compare numerical values across a range of categories.

         <div class="widgets" controller={PageController}>
            <Svg style="width:500px; height:400px;">
               <Chart offset="20 -20 -40 130" axes={{
                  x: { type: NumericAxis, snapToTicks: 0 },
                  y: { type: CategoryAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <Repeater records:bind="$page.points" recordName="$point" sorters:bind="$page.sorters">
                     <Bar colorIndex={0}
                          name="Value 1"
                          height={0.3}
                          offset={-0.15}
                          active:bind="$page.v1"
                          x:bind="$point.v1"
                          y:bind="$point.key"
                          tooltip:tpl="{$point.v1:n;0}" />

                     <Bar colorIndex={5}
                          name="Value 2"
                          height={0.3}
                          offset={0.15}
                          active:bind="$page.v2"
                          x:bind="$point.v2"
                          y:bind="$point.key"
                          tooltip:tpl="{$point.v2:n;0}" />
                  </Repeater>
               </Chart>
            </Svg>
            <Legend vertical />
         </div>

         <CodeSnippet putInto="code">{`
            class PageController extends Controller {
               init() {
                  super.init();
                  this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
                     key: casual.city,
                     v1: 100 + Math.random() * 300,
                     v2: 100 + Math.random() * 400
                  })));
               }
            }
            ...
            <Svg style="width:500px; height:400px;">
               <Chart offset="20 -20 -40 130" axes={{
                  x: { type: NumericAxis, snapToTicks: 0 },
                  y: { type: CategoryAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <Repeater records:bind="$page.points" recordName="$point" sorters:bind="$page.sorters">
                     <Bar colorIndex={0}
                          name="Value 1"
                          height={0.3}
                          offset={-0.15}
                          active:bind="$page.v1"
                          x:bind="$point.v1"
                          y:bind="$point.key"
                          tooltip:tpl="{$point.v1:n;0}" />

                     <Bar colorIndex={5}
                          name="Value 2"
                          height={0.3}
                          offset={0.15}
                          active:bind="$page.v2"
                          x:bind="$point.v2"
                          y:bind="$point.key"
                          tooltip:tpl="{$point.v2:n;0}" />
                  </Repeater>
               </Chart>
            </Svg>
         `}</CodeSnippet>
      </CodeSplit>

      Examples:

      * [Combination](~/examples/charts/bar/combination)
      * [Stacked](~/examples/charts/bar/stacked)
      * [Bullets](~/examples/charts/bar/bullets)

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

