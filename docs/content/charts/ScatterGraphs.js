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
import {Marker} from 'cx/ui/svg/charts/series/Marker';
import {ScatterGraph} from 'cx/ui/svg/charts/ScatterGraph';
import {Legend} from 'cx/ui/svg/charts/Legend';

import configs from './configs/ScatterGraph';

class PageController extends Controller {
   init() {
      super.init();
      this.store.set('$page.reds', Array.from({length: 200}, (_, i) => ({
         x: 100+Math.random() * 300,
         y: Math.random() * 300,
         size: Math.random() * 20
      })));
      this.store.set('$page.blues', Array.from({length: 200}, (_, i) => ({
         x: Math.random() * 300,
         y: 100 + Math.random() * 300,
         size: Math.random() * 20
      })));
   }
}

export const ScatterGraphs = <cx>
   <Md>
      <CodeSplit>

         # ScatterGraph

         The `ScatterGraph` widget is used for rendering scatter graphs.

         <div class="widgets" controller={PageController}>
            <Svg style="width:500px; height:400px;">
               <Chart offset="20 -20 -40 130" axes={{
                  x: { type: NumericAxis, snapToTicks: 1 },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <ScatterGraph data:bind="$page.reds"
                                name="Reds"
                                colorIndex={1}
                                shape="square"
                                sizeField="size"
                                active:bind="$page.showReds"
                  />

                  <ScatterGraph data:bind="$page.blues"
                                name="Blues"
                                colorIndex={5}
                                sizeField="size"
                                active:bind="$page.showBlues"
                  />

               </Chart>
            </Svg>
            <Legend vertical />
         </div>

         <CodeSnippet putInto="code">{`
            class PageController extends Controller {
               init() {
                  super.init();
                  this.store.set('$page.reds', Array.from({length: 200}, (_, i) => ({
                     x: 100+Math.random() * 300,
                     y: Math.random() * 300,
                     size: Math.random() * 20
                  })));
                  this.store.set('$page.blues', Array.from({length: 200}, (_, i) => ({
                     x: Math.random() * 300,
                     y: 100 + Math.random() * 300,
                     size: Math.random() * 20
                  })));
               }
            }
            ...
            <div class="widgets" controller={PageController}>
            <Svg style="width:500px; height:400px;">
               <Chart offset="20 -20 -40 130" axes={{
                  x: { type: NumericAxis, snapToTicks: 1 },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <ScatterGraph data:bind="$page.reds"
                                name="Reds"
                                colorIndex={1}
                                shape="square"
                                sizeField="size"
                                active:bind="$page.showReds"
                  />

                  <ScatterGraph data:bind="$page.blues"
                                name="Blues"
                                colorIndex={5}
                                sizeField="size"
                                active:bind="$page.showBlues"
                  />

               </Chart>
            </Svg>
            <Legend vertical />
         </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

