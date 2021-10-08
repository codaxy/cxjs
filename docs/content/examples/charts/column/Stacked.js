import { HtmlElement, Grid, Repeater, Content, Tab } from 'cx/widgets';
import { Controller, KeySelection } from 'cx/ui';
import { Svg, Rectangle, Text } from 'cx/svg';
import { Gridlines, NumericAxis, CategoryAxis, Chart, Column, Legend } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';



var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.points', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: Math.random() * 30,
         v2: Math.random() * 30,
         v3: Math.random() * 30,
         a1: Math.random() * 30,
         a2: Math.random() * 30,
         a3: Math.random() * 30,
      })));
   }
}

export const Stacked = <cx>
   <Md controller={PageController}>
      <CodeSplit>
         # Stacked Bar Chart

         This example shows stacked bar chart with multiple stacks.

         <div class="widgets">
            <div>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -20 -40 40" axes={{ x: { type: CategoryAxis }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
                     <Gridlines/>
                     <Repeater records:bind="$page.points" recordAlias="$point">
                        <Column name="V1"
                                active:bind="$page.v1"
                                colorIndex={2}
                                width={0.3}
                                offset={-0.15}
                                x:bind="$point.x"
                                y:bind="$point.v1"
                                tooltip:tpl="V1 {$point.x} {$point.v1:n}"
                                stack="v"
                                stacked />

                        <Column name="V2"
                                active:bind="$page.v2"
                                colorIndex={1}
                                width={0.3}
                                offset={-0.15}
                                x:bind="$point.x"
                                y:bind="$point.v2"
                                tooltip:tpl="V2 {$point.x} {$point.v2:n}"
                                stack="v"
                                stacked />

                        <Column name="V3"
                                active:bind="$page.v3"
                                colorIndex={0}
                                width={0.3}
                                offset={-0.15}
                                x:bind="$point.x"
                                y:bind="$point.v3"
                                tooltip:tpl="V3 {$point.x} {$point.v3:n}"
                                stack="v"
                                stacked />

                        <Column name="A1"
                                active:bind="$page.a1"
                                colorIndex={11}
                                width={0.3}
                                offset={0.15}
                                x:bind="$point.x"
                                y:bind="$point.a1"
                                tooltip:tpl="A1 {$point.x} {$point.a1:n}"
                                stack="a"
                                stacked />

                        <Column name="A2"
                                active:bind="$page.a2"
                                colorIndex={12}
                                width={0.3}
                                offset={0.15}
                                x:bind="$point.x"
                                y:bind="$point.a2"
                                tooltip:tpl="A2 {$point.x} {$point.a2:n}"
                                stack="a"
                                stacked />

                        <Column name="A3"
                                active:bind="$page.a3"
                                colorIndex={13}
                                width={0.3}
                                offset={0.15}
                                x:bind="$point.x"
                                y:bind="$point.a3"
                                tooltip:tpl="A3 {$point.x} {$point.a3:n}"
                                stack="a"
                                stacked />

                     </Repeater>
                  </Chart>
               </Svg>
               <Legend />
               </div>
         </div>

         <Content name="code">
            <div>
               <Tab value-bind="$page.code.tab" tab="controller" mod="code"><code>Controller</code></Tab>
               <Tab value-bind="$page.code.tab" tab="chart" mod="code" default><code>Chart</code></Tab>
            </div>
            <CodeSnippet fiddle="9AHWzPA2" visible-expr="{$page.code.tab}=='controller'">{`
         var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

         class PageController extends Controller {
            init() {
               super.init();

               this.store.set('$page.points', Array.from({length: categories.length}, (_, i) => ({
                  x: categories[i],
                  v1: Math.random() * 30,
                  v2: Math.random() * 30,
                  v3: Math.random() * 30,
                  a1: Math.random() * 30,
                  a2: Math.random() * 30,
                  a3: Math.random() * 30,
               })));
            }
         }
         `}</CodeSnippet>
         <CodeSnippet fiddle="9AHWzPA2" visible-expr="{$page.code.tab}=='chart'">{`
         <Svg style="width:600px; height:400px;">
            <Chart offset="20 -20 -40 40" axes={{ x: { type: CategoryAxis }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
               <Gridlines/>
               <Repeater records:bind="$page.points" recordAlias="$point">
                  <Column name="V1"
                          active:bind="$page.v1"
                          colorIndex={2}
                          width={0.3}
                          offset={-0.15}
                          x:bind="$point.x"
                          y:bind="$point.v1"
                          tooltip:tpl="V1 {$point.x} {$point.v1:n}"
                          stack="v"
                          stacked />

                  <Column name="V2"
                          active:bind="$page.v2"
                          colorIndex={1}
                          width={0.3}
                          offset={-0.15}
                          x:bind="$point.x"
                          y:bind="$point.v2"
                          tooltip:tpl="V2 {$point.x} {$point.v2:n}"
                          stack="v"
                          stacked />

                  <Column name="V3"
                          active:bind="$page.v3"
                          colorIndex={0}
                          width={0.3}
                          offset={-0.15}
                          x:bind="$point.x"
                          y:bind="$point.v3"
                          tooltip:tpl="V3 {$point.x} {$point.v3:n}"
                          stack="v"
                          stacked />

                  <Column name="A1"
                          active:bind="$page.a1"
                          colorIndex={11}
                          width={0.3}
                          offset={0.15}
                          x:bind="$point.x"
                          y:bind="$point.a1"
                          tooltip:tpl="A1 {$point.x} {$point.a1:n}"
                          stack="a"
                          stacked />

                  <Column name="A2"
                          active:bind="$page.a2"
                          colorIndex={12}
                          width={0.3}
                          offset={0.15}
                          x:bind="$point.x"
                          y:bind="$point.a2"
                          tooltip:tpl="A2 {$point.x} {$point.a2:n}"
                          stack="a"
                          stacked />

                  <Column name="A3"
                          active:bind="$page.a3"
                          colorIndex={13}
                          width={0.3}
                          offset={0.15}
                          x:bind="$point.x"
                          y:bind="$point.a3"
                          tooltip:tpl="A3 {$point.x} {$point.a3:n}"
                          stack="a"
                          stacked />

               </Repeater>
            </Chart>
         </Svg>
         <Legend />
          `}</CodeSnippet>
         </Content>
      </CodeSplit>
   </Md>
</cx>;

