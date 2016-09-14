import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {LineGraph} from 'cx/ui/svg/charts/LineGraph';
import {Legend} from 'cx/ui/svg/charts/Legend';

import configs from './configs/LineGraph';

class PageController extends Controller {
   init() {
      super.init();
      var y1 = 250, y2 = 350;
      this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y: i % 20 == 3 ? null : (y1 = (y1 + (Math.random() - 0.5) * 30)),
         y2: y2 = (y2 + (Math.random() - 0.5) * 30),
         y2l: y2 - 50,
         y2h: y2 + 50
      })));
   }
}


export const LineGraphs = <cx>
   <Md>
      # Line Graphs

      Line charts are commonly used to visualize trends in data.

      <CodeSplit>

         <div class="widgets" controller={PageController}>
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <LineGraph data:bind="$page.points" colorIndex={8} yField="y2h" y0Field="y2l" active:bind="$page.line2" line={false} area/>
                  <LineGraph name="Line 1" data:bind="$page.points" colorIndex={0} area active:bind="$page.line1"/>
                  <LineGraph name="Line 2" data:bind="$page.points" colorIndex={8} yField="y2" active:bind="$page.line2"/>
               </Chart>
            </Svg>
            <Legend />
         </div>

         <CodeSnippet putInto="code">{`
            class PageController extends Controller {
               init() {
                  super.init();
                  var y1 = 150, y2 = 250;
                  this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
                     x: i * 4,
                     y: i % 20 == 3 ? null : (y1 = (y1 + (Math.random() - 0.5) * 30)),
                     y2: y2 = (y2 + (Math.random() - 0.5) * 30),
                     y2l: y2 - 50,
                     y2h: y2 + 50
                  })));
               }
            }
            ...
            <div class="widgets" controller={PageController}>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                     <Gridlines/>
                     <LineGraph data:bind="$page.points" colorIndex={8} yField="y2h" y0Field="y2l" active:bind="$page.line2" line={false} area/>
                     <LineGraph name="Line 1" data:bind="$page.points" colorIndex={0} area active:bind="$page.line1"/>
                     <LineGraph name="Line 2" data:bind="$page.points" colorIndex={8} yField="y2" active:bind="$page.line2"/>
                  </Chart>
               </Svg>
               <Legend />
            </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Examples

      * [Stacked](~/examples/charts/line/stacked)

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

