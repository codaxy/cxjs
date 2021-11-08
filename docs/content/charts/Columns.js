import { HtmlElement, Grid, Repeater } from 'cx/widgets';
import { Controller, KeySelection } from 'cx/ui';
import { Svg, Rectangle, Text } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, Column, Legend } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';


import {casual} from 'docs/content/examples/data/casual';

import configs from './configs/Column';

var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.points', Array.from({length: 30}, (_, i) => ({
         x: casual.city,
         y: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10
      })));
   }
}

export const Columns = <cx>
   <Md controller={PageController}>
      # Column

      <ImportPath path="import {Column} from 'cx/charts';" />

      <CodeSplit>

         The `Column` widget is used to make column charts where each column has unique properties
         or additional content inside.

         <div class="widgets">
            <div>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -20 -140 40" axes={{
                     x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                     y: { type: NumericAxis, vertical: true } }}>
                     <Gridlines/>
                     <Repeater records:bind="$page.points" recordAlias="$point">
                        <Column colorIndex-expr="15 - Math.round({$point.y}*6/50)"
                                width={0.8}
                                x-bind="$point.x"
                                y-bind="$point.y"
                                tooltip:tpl="{$point.x} {$point.y:n;0}" />
                     </Repeater>
                  </Chart>
               </Svg>
               <Legend />
            </div>
         </div>

         <CodeSnippet putInto="code" fiddle="Ve2AulIi">{`
            class PageController extends Controller {
               init() {
                  super.init();

                  this.store.set('$page.points', Array.from({length: 30}, (_, i) => ({
                     x: casual.city,
                     y: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10
                  })));
               }
            }
            ...
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -20 -140 40" axes={{
                  x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                  y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <Repeater records:bind="$page.points" recordAlias="$point">
                     <Column colorIndex-expr="15 - Math.round({$point.y}*6/50)"
                             width={0.8}
                             x-bind="$point.x"
                             y-bind="$point.y"
                             tooltip:tpl="{$point.x} {$point.y:n;0}" />
                  </Repeater>
               </Chart>
            </Svg>
            <Legend />
          `}</CodeSnippet>
      </CodeSplit>

      ## Examples:

      * [Combination](~/examples/charts/column/combination)
      * [Stacked](~/examples/charts/column/stacked)
      * [Normalized](~/examples/charts/column/normalized)
      * [Auto Width](~/examples/charts/column/auto-width)

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>;

