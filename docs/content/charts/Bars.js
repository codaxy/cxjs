import { HtmlElement, Repeater } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, Bar, Legend } from 'cx/charts';
import { Md } from 'docs/components/Md';
import { CodeSplit } from 'docs/components/CodeSplit';
import { CodeSnippet } from 'docs/components/CodeSnippet';
import { ConfigTable } from 'docs/components/ConfigTable';
import { ImportPath } from 'docs/components/ImportPath';
import { casual } from 'docs/content/examples/data/casual';


import configs from './configs/Bar';

class PageController extends Controller {
    onInit() {
        this.store.init('$page.points', Array.from({ length: 11 }, (_, i) => ({
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

         <ImportPath path="import {Bar} from 'cx/charts';" />

         Bar charts are commonly used to compare numerical values across a range of categories.

         <div class="widgets" controller={PageController}>
                <Svg style="width:500px; height:400px;">
                    <Chart offset="20 -20 -40 130" axes={{
                        x: { type: NumericAxis, snapToTicks: 0 },
                        y: { type: CategoryAxis, vertical: true, snapToTicks: 1 }
                    }}>
                        <Gridlines />
                        <Repeater records:bind="$page.points" recordAlias="$point" sorters:bind="$page.sorters">
                     <Bar colorIndex={0}
                            name="Value 1"
                            height={0.3}
                            offset={-0.15}
                            active:bind="$page.v1"
                          x:bind="$point.v1"
                          y:bind="$point.key"
                          tooltip-tpl="{$point.v1:n;0}" />

                     <Bar colorIndex={5}
                            name="Value 2"
                            height={0.3}
                            offset={0.15}
                            active:bind="$page.v2"
                          x:bind="$point.v2"
                          y:bind="$point.key"
                          tooltip-tpl="{$point.v2:n;0}" />
                  </Repeater>
               </Chart>
            </Svg>
            <Legend vertical />
         </div>

        <CodeSnippet putInto="code" fiddle="4AAhIi6b">{`
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
                  <Repeater records:bind="$page.points" recordAlias="$point" sorters:bind="$page.sorters">
                     <Bar colorIndex={0}
                          name="Value 1"
                          height={0.3}
                          offset={-0.15}
                          active:bind="$page.v1"
                          x:bind="$point.v1"
                          y:bind="$point.key"
                          tooltip-tpl="{$point.v1:n;0}" />

                     <Bar colorIndex={5}
                          name="Value 2"
                          height={0.3}
                          offset={0.15}
                          active:bind="$page.v2"
                          x:bind="$point.v2"
                          y:bind="$point.key"
                          tooltip-tpl="{$point.v2:n;0}" />
                  </Repeater>
               </Chart>
               <Legend />
            </Svg>
         `}</CodeSnippet>
      </CodeSplit>

      ## Examples:

      * [Combination](~/examples/charts/bar/combination)
      * [Stacked](~/examples/charts/bar/stacked)
      * [Bullets](~/examples/charts/bar/bullets)
      * [Scrollable Bar Charts](~/examples/charts/bar/scrollable-bars)

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx >

