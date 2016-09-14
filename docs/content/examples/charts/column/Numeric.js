import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Columns} from 'cx/ui/svg/charts/series/Columns';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 100;
      var v2 = 110;
      this.store.set('$page.points', Array.from({length: 11}, (_, i) => ({
         x: i * 5,
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v2 = (v2 + (Math.random() - 0.5) * 30)
      })));
   }
}


export const Numeric = <cx>
   <Md>
      # Column Chart Example

      This example shows how to use numeric values on X axis.

      <CodeSplit>

         <div class="widgets" controller={PageController}>
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -20 -40 40" axes={{ x: { type: NumericAxis, snapToTicks: 0 }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
                  <Gridlines/>
                  <Columns data:bind="$page.points" style="stroke:#88f;stroke-width:1px;fill:#eef" columnWidth={1} offset={-0.5} yField="v1"/>
                  <Columns data:bind="$page.points" style="stroke:#f88;stroke-width:1px;fill:#fee" columnWidth={1} offset={+0.5} yField="v2"/>
               </Chart>
            </Svg>
         </div>

         <CodeSnippet putInto="code">{`
             <div class="widgets">

             </div>
         `}</CodeSnippet>
      </CodeSplit>
   </Md>
</cx>;

