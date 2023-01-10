import { Content, HtmlElement, Repeater, Tab } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, Marker, Legend } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';
import {casual} from 'docs/content/examples/data/casual';



import configs from './configs/Marker';

class PageController extends Controller {
   init() {
      super.init();
      this.store.set('$page.reds', Array.from({length: 50}, (_, i) => ({
         x: 100+Math.random() * 300,
         y: Math.random() * 300,
         size: 10 + Math.random() * 30,
         color: Math.floor(Math.random() * 3)
      })));
      this.store.set('$page.blues', Array.from({length: 50}, (_, i) => ({
         x: Math.random() * 300,
         y: 100 + Math.random() * 300,
         size: 10 + Math.random() * 30,
         color: 4 + Math.floor(Math.random() * 3)
      })));
   }
}

export const Markers = <cx>
   <Md>
      <CodeSplit>

         # Marker

         <ImportPath path="import {Marker} from 'cx/charts';" />

         Markers are commonly used for scatter charts.

         <div class="widgets" controller={PageController}>
            <Svg style="width:500px; height:400px;">
               <Chart offset="20 -20 -40 130" axes={{
                  x: { type: NumericAxis, snapToTicks: 1 },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <Repeater records-bind="$page.reds" recordAlias="$point">
                     <Marker colorIndex-bind="$point.color"
                            legendColorIndex={1}
                            active-bind="$page.showReds"
                            name="Reds"
                            size-bind="$point.size"
                            x-bind="$point.x"
                            y-bind="$point.y"
                            tooltip-tpl="Red ({$point.x:n;0}, {$point.y:n;0})"
                            style={{fillOpacity: 0.5}}
                            draggableX draggableY
                     />
                  </Repeater>
                  <Repeater records-bind="$page.blues" recordAlias="$point">
                     <Marker colorIndex-bind="$point.color"
                            legendColorIndex={5}
                            active-bind="$page.showBlues"
                            name="Blues"
                            size-bind="$point.size"
                            x-bind="$point.x"
                            y-bind="$point.y"
                            tooltip-tpl="Blue ({$point.x:n;0}, {$point.y:n;0})"
                            style={{fillOpacity: 0.5}}
                            draggableX draggableY/>
                  </Repeater>
               </Chart>
            </Svg>
            <Legend vertical />
         </div>
            
         <Content name="code">
            <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller"/>
            <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default/>
            <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="SqfLY8YB">{`
               class PageController extends Controller {
                  init() {
                     super.init();
                     this.store.set('$page.reds', Array.from({length: 50}, (_, i) => ({
                        x: 100+Math.random() * 300,
                        y: Math.random() * 300,
                        size: 10 + Math.random() * 30,
                        color: Math.floor(Math.random() * 3)
                     })));
                     this.store.set('$page.blues', Array.from({length: 50}, (_, i) => ({
                        x: Math.random() * 300,
                        y: 100 + Math.random() * 300,
                        size: 10 + Math.random() * 30,
                        color: 4 + Math.floor(Math.random() * 3)
                     })));
                  }
               }
            `}</CodeSnippet>
            <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="SqfLY8YB">{`
            <div class="widgets" controller={PageController}>
               <Svg style="width:500px; height:400px;">
                  <Chart offset="20 -20 -40 130" axes={{
                     x: { type: NumericAxis, snapToTicks: 1 },
                     y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
                  }}>
                     <Gridlines/>
                     <Repeater records-bind="$page.reds" recordAlias="$point">
                        <Marker colorIndex-bind="$point.color"
                              legendColorIndex={1}
                              active-bind="$page.showReds"
                              name="Reds"
                              size-bind="$point.size"
                              x-bind="$point.x"
                              y-bind="$point.y"
                              tooltip-tpl="Red ({$point.x:n;0}, {$point.y:n;0})"
                              style={{fillOpacity: 0.5}}
                              draggableX draggableY
                        />
                     </Repeater>
                     <Repeater records-bind="$page.blues" recordAlias="$point">
                        <Marker colorIndex-bind="$point.color"
                              legendColorIndex={5}
                              active-bind="$page.showBlues"
                              name="Blues"
                              size-bind="$point.size"
                              x-bind="$point.x"
                              y-bind="$point.y"
                              tooltip-tpl="Blue ({$point.x:n;0}, {$point.y:n;0})"
                              style={{fillOpacity: 0.5}}
                              draggableX draggableY/>
                     </Repeater>
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

