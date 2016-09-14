import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';
import {Repeater} from 'cx/ui/Repeater';

import {Svg} from 'cx/ui/svg/Svg';
import {Text} from 'cx/ui/svg/Text';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Line} from 'cx/ui/svg/Line';
import {PieChart, PieSlice} from 'cx/ui/svg/charts/PieChart';
import {Legend} from 'cx/ui/svg/charts/Legend';

import {KeySelection} from 'cx/ui/selection/KeySelection';

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

export const Multilevel = <cx>
   <Md>

      <CodeSplit>
         # Multilevel Pie Charts

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
                                    name:tpl="Item {$index}"
                                    selection={{
                                       type: KeySelection,
                                       bind:'$page.selection',
                                       records: {bind:'$page.points'},
                                       record: {bind:'$record'},
                                       index: {bind:'$index'},
                                       keyField: 'x'
                                    }}>
                        </PieSlice>
                        <Repeater records:bind="$record.slices" recordName="$slice" indexName="$sliceIndex">
                           <PieSlice value:bind='$slice.sv'
                                      active:bind='$record.active'
                                      colorIndex:expr='{$index} * 3 % 16'
                                      r:expr='90'
                                      r0:expr='58'
                                      offset={3}
                                      name:tpl="Slice {$sliceIndex}"
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

         <CodeSnippet putInto="code">{`
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
         ...
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
                                    name:tpl="Item {$index}"
                                    selection={{
                                       type: KeySelection,
                                       bind:'$page.selection',
                                       records: {bind:'$page.points'},
                                       record: {bind:'$record'},
                                       index: {bind:'$index'},
                                       keyField: 'x'
                                    }}>
                        </PieSlice>
                        <Repeater records:bind="$record.slices" recordName="$slice" indexName="$sliceIndex">
                           <PieSlice value:bind='$slice.sv'
                                      active:bind='$record.active'
                                      colorIndex:expr='{$index} * 3 % 16'
                                      r:expr='90'
                                      r0:expr='58'
                                      offset={3}
                                      name:tpl="Slice {$sliceIndex}"
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
      </CodeSplit>
   </Md>
</cx>

