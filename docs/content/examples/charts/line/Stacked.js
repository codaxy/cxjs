import { HtmlElement, Checkbox } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, Chart, LineGraph, Legend } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';



class PageController extends Controller {
   init() {
      super.init();
      this.store.init('$page.stack', true);
      var y1 = 300, y2 = 200, y3 = 100;
      this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y1: y1 = (y1 + (Math.random() - 0.5) * 30),
         y2: y2 = (y2 + (Math.random() - 0.5) * 30),
         y3: y3 = (y3 + (Math.random() - 0.5) * 30)
      })));
   }
}


export const Stacked = <cx>
   <Md>
      # Stacked Line Chart

      This example shows how to create a stacked line chart.

      <CodeSplit>

         <div class="widgets" controller={PageController}>
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <LineGraph name="Line 1" data:bind="$page.points" colorIndex={0} area:bind="$page.stack" yField="y1" active:bind="$page.line1" stacked:bind="$page.stack" />
                  <LineGraph name="Line 2" data:bind="$page.points" colorIndex={5} area:bind="$page.stack" yField="y2" active:bind="$page.line2" stacked:bind="$page.stack" />
                  <LineGraph name="Line 3" data:bind="$page.points" colorIndex={10} area:bind="$page.stack" yField="y3" active:bind="$page.line3" stacked:bind="$page.stack" />
               </Chart>
            </Svg>
            <Legend />
            <Checkbox value:bind="$page.stack">Stack</Checkbox>
         </div>

         <CodeSnippet putInto="code">{`
            class PageController extends Controller {
               init() {
                  super.init();
                  this.store.init('$page.stack', true);
                  var y1 = 300, y2 = 200, y3 = 100;
                  this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
                     x: i * 4,
                     y1: y1 = (y1 + (Math.random() - 0.5) * 30),
                     y2: y2 = (y2 + (Math.random() - 0.5) * 30),
                     y3: y3 = (y3 + (Math.random() - 0.5) * 30)
                  })));
               }
            }
            ...
            <div class="widgets" controller={PageController}>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                     <Gridlines/>
                     <LineGraph name="Line 1" data:bind="$page.points" colorIndex={0} area:bind="$page.stack" yField="y1" active:bind="$page.line1" stacked:bind="$page.stack" />
                     <LineGraph name="Line 2" data:bind="$page.points" colorIndex={5} area:bind="$page.stack" yField="y2" active:bind="$page.line2" stacked:bind="$page.stack" />
                     <LineGraph name="Line 3" data:bind="$page.points" colorIndex={10} area:bind="$page.stack" yField="y3" active:bind="$page.line3" stacked:bind="$page.stack" />
                  </Chart>
               </Svg>
               <Legend />
               <Checkbox value:bind="$page.stack">Stack</Checkbox>
            </div>
         `}</CodeSnippet>
      </CodeSplit>



   </Md>
</cx>

