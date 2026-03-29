import { Content, HtmlElement, Repeater, Tab } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, Marker, ScatterGraph, Legend } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';
import {casual} from 'docs/content/examples/data/casual';



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

         <ImportPath path="import {ScatterGraph} from 'cx/charts';" />

         The `ScatterGraph` widget is used for rendering scatter graphs.

         <div class="widgets" controller={PageController}>
            <Svg style="width:500px; height:400px;">
               <Chart offset="20 -20 -40 130" axes={{
                  x: { type: NumericAxis, snapToTicks: 1 },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <ScatterGraph data-bind="$page.reds"
                                name="Reds"
                                colorIndex={1}
                                shape="square"
                                sizeField="size"
                                active-bind="$page.showReds"
                  />

                  <ScatterGraph data-bind="$page.blues"
                                name="Blues"
                                colorIndex={5}
                                sizeField="size"
                                active-bind="$page.showBlues"
                  />

               </Chart>
            </Svg>
            <Legend vertical />
         </div>
         <Content name="code">
            <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
            <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>

            <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="ICvov0Mt">{`
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
            `}</CodeSnippet>
            <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="ICvov0Mt">{`
            <div class="widgets" controller={PageController}>
               <Svg style="width:500px; height:400px;">
                  <Chart offset="20 -20 -40 130" axes={{
                     x: { type: NumericAxis, snapToTicks: 1 },
                     y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
                  }}>
                     <Gridlines/>
                     <ScatterGraph data-bind="$page.reds"
                                 name="Reds"
                                 colorIndex={1}
                                 shape="square"
                                 sizeField="size"
                                 active-bind="$page.showReds"
                     />

                     <ScatterGraph data-bind="$page.blues"
                                 name="Blues"
                                 colorIndex={5}
                                 sizeField="size"
                                 active-bind="$page.showBlues"
                     />

                  </Chart>
               </Svg>
               <Legend vertical />
            </div>
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

