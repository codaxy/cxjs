import { Content, HtmlElement, Repeater, Tab } from 'cx/widgets';
import { Controller, KeySelection } from 'cx/ui';
import { Svg, Text, Rectangle, Line } from 'cx/svg';
import { PieChart, PieSlice, Legend } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';




class PageController extends Controller {
   init() {
      super.init();
      this.store.set('$page.points', Array.from({length: 7}).map((_, i) => {
         var value = 20 + Math.random() * 100;
         return {
            x: i * 5,
            v: value,
            slices: Array.from({length: 5}).map(x=>({sv: value / 5}))
         }
      }));
   }
}

export const MultiLevel = <cx>
   <Md>

      <CodeSplit>
         # Multi-level Pie Charts

         This example shows how to implement a multilevel pie chart.

         <div class="widgets" controller={PageController}>
            <Legend />
               <Svg style="width:400px; height:400px;">
                  <PieChart angle={360}>
                     <Repeater records:bind="$page.points">
                        <PieSlice value:bind='$record.v'
                                   active:bind='$record.active'
                                    colorIndex:expr='{$index} * 3 % 16'
                                    r:expr='55'
                                    r0:expr='20'
                                    offset={3}
                                    name-tpl="Item {$index}"
                                    selection={{
                                       type: KeySelection,
                                       bind:'$page.selection',
                                       records: {bind:'$page.points'},
                                       record: {bind:'$record'},
                                       index: {bind:'$index'},
                                       keyField: 'x'
                                    }}>
                        </PieSlice>
                        <Repeater records:bind="$record.slices" recordAlias="$slice" indexAlias="$sliceIndex">
                           <PieSlice value:bind='$slice.sv'
                                      active:bind='$record.active'
                                      colorIndex:expr='{$index} * 3 % 16'
                                      r:expr='90'
                                      r0:expr='58'
                                      offset={3}
                                      name-tpl="Slice {$sliceIndex}"
                                      legend:expr="{$page.selection} == {$record.x} ? 'slice' : false"
                                      stack="outer"
                                      style={{
                                       fillOpacity: {expr: '0.3 + 0.7 * ({$sliceIndex} / 4)'}
                                      }}
                                      selection={{
                                          type: KeySelection,
                                          bind:'$page.selection',
                                          records: {bind:'$page.points'},
                                          record: {bind:'$record'},
                                          index: {bind:'$index'},
                                          keyField: 'x'
                                       }}>
                           </PieSlice>
                        </Repeater>
                     </Repeater>
                  </PieChart>
               </Svg>
               <Legend name="slice" vertical />
         </div>
         
         <Content name="code">
            <div>
               <Tab value-bind="$page.code.tab" tab="controller" mod="code"><code>Controller</code></Tab>
               <Tab value-bind="$page.code.tab" tab="chart" mod="code" default><code>Chart</code></Tab>
            </div>

            <CodeSnippet fiddle="kn9A3wlj" visible-expr="{$page.code.tab}=='controller'">{`
         class PageController extends Controller {
            init() {
               super.init();
               this.store.set('$page.points', Array.from({length: 7}).map((_, i) => {
                  var value = 20 + Math.random() * 100;
                  return {
                     x: i * 5,
                     v: value,
                     slices: Array.from({length: 5}).map(x=>({sv: value / 5}))
                  }
               }));
            }
         }
         `}</CodeSnippet>
         <CodeSnippet fiddle="kn9A3wlj" visible-expr="{$page.code.tab}=='chart'">{`
         <div class="widgets" controller={PageController}>
            <Legend />
               <Svg style="width:400px; height:400px;">
                  <PieChart angle={360}>
                     <Repeater records:bind="$page.points">
                        <PieSlice value:bind='$record.v'
                                   active:bind='$record.active'
                                    colorIndex:expr='{$index} * 3 % 16'
                                    r:expr='55'
                                    r0:expr='20'
                                    offset={3}
                                    name-tpl="Item {$index}"
                                    selection={{
                                       type: KeySelection,
                                       bind:'$page.selection',
                                       records: {bind:'$page.points'},
                                       record: {bind:'$record'},
                                       index: {bind:'$index'},
                                       keyField: 'x'
                                    }}>
                        </PieSlice>
                        <Repeater records:bind="$record.slices" recordAlias="$slice" indexAlias="$sliceIndex">
                           <PieSlice value:bind='$slice.sv'
                                      active:bind='$record.active'
                                      colorIndex:expr='{$index} * 3 % 16'
                                      r:expr='90'
                                      r0:expr='58'
                                      offset={3}
                                      name-tpl="Slice {$sliceIndex}"
                                      legend:expr="{$page.selection} == {$record.x} ? 'slice' : false"
                                      stack="outer"
                                      style={{
                                       fillOpacity: {expr: '0.3 + 0.7 * ({$sliceIndex} / 4)'}
                                      }}
                                      selection={{
                                          type: KeySelection,
                                          bind:'$page.selection',
                                          records: {bind:'$page.points'},
                                          record: {bind:'$record'},
                                          index: {bind:'$index'},
                                          keyField: 'x'
                                       }}>
                           </PieSlice>
                        </Repeater>
                     </Repeater>
                  </PieChart>
               </Svg>
               <Legend name="slice" vertical />
         </div>
         `}</CodeSnippet>
         </Content>
      </CodeSplit>
   </Md>
</cx>

