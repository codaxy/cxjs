import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {CategoryAxis} from 'cx/ui/svg/charts/axis/CategoryAxis';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Columns} from 'cx/ui/svg/charts/series/Columns';
import {Column} from 'cx/ui/svg/charts/series/Column';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Text} from 'cx/ui/svg/Text';
import {Repeater} from 'cx/ui/Repeater';

var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 100;
      var v2 = 110;

      this.store.set('$page.points', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v2 = (v2 + (Math.random() - 0.5) * 30)
      })));
   }
}


export const Category = <cx>
   <Md controller={PageController}>
      # Column Chart Example

      This example shows how to use category values on X axis.

      <CodeSplit>

         <div class="widgets">
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -20 -40 40" axes={{ x: { type: CategoryAxis }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
                  <Gridlines/>
                  <Columns data:bind="$page.points" style="stroke:#88f;stroke-width:1px;fill:#eef" columnWidth={0.3} offset={-0.15} yField="v1"/>
                  <Columns data:bind="$page.points" style="stroke:#f88;stroke-width:1px;fill:#fee" columnWidth={0.3} offset={+0.15} yField="v2"/>
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

