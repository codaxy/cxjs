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
import {ColorMap} from 'cx/ui/svg/charts/ColorMap';

import {KeySelection} from 'cx/ui/selection/KeySelection';

import pieConfigs from './configs/PieChart';
import sliceConfigs from './configs/PieSlice';

class PageController extends Controller {
   init() {
      super.init();
      var value = 100;
      this.store.set('$page.points', Array.from({length: 7}, (_, i) => ({
         id: i,
         name: 'Item ' + (i+1),
         value: value = (value + (Math.random() - 0.5) * 30),
      })));
   }
}

export const PieCharts = <cx>
   <Md>
      <CodeSplit>
         # Pie Charts

         Pie charts are commonly used to compare parts to the whole. In Cx, pie charts are implemented using `PieChart` and
         `PieSlice`.

         <div class="widgets" controller={PageController}>
            <Legend />
            <div>
               <Svg style="width:600px; height:400px;">
                  <ColorMap />
                  <PieChart angle={360}>
                     <Repeater records:bind="$page.points">
                        <PieSlice value:bind='$record.value'
                                  active:bind='$record.active'
                                  colorMap="pie"
                                  r={80}
                                  r0={20}
                                  offset={5}
                                  tooltip:tpl="{$record.name}: {$record.value:n;1}"
                                  innerPointRadius={80}
                                  outerPointRadius={90}
                                  name:bind="$record.name"
                                  selection={{
                                     type: KeySelection,
                                     bind: '$page.selection',
                                     records: {bind: '$page.points'},
                                     record: {bind: '$record'},
                                     index: {bind: '$index'},
                                     keyField: 'id'
                                  }}>
                              <Line style="stroke:gray" />
                              <Rectangle anchors='1 1 1 1' offset="-10 20 10 -20" style="fill:white">
                                 <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                              </Rectangle>
                           </PieSlice>
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
         </div>

         <CodeSnippet putInto="code">{`
         <div class="widgets" controller={PageController}>
            <Legend />
            <div>
               <Svg style="width:600px; height:400px;">
                  <ColorMap />
                  <PieChart angle={360}>
                     <Repeater records:bind="$page.points">
                        <PieSlice value:bind='$record.value'
                                  active:bind='$record.active'
                                  colorMap="pie"
                                  r:expr='80'
                                  r0:expr='20'
                                  offset={5}
                                  tooltip:tpl="Item {$index}: {$record.value:n}"
                                  innerPointRadius={80}
                                  outerPointRadius={90}
                                  name:tpl="Item {$index}"
                                  selection={{
                                     type: KeySelection,
                                     bind: '$page.selection',
                                     records: {bind: '$page.points'},
                                     record: {bind: '$record'},
                                     index: {bind: '$index'},
                                     keyField: 'id'
                                  }}>
                              <Line style="stroke:gray" />
                              <Rectangle anchors='1 1 1 1' offset="-10 20 10 -20" style="fill:white">
                                 <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                              </Rectangle>
                           </PieSlice>
                     </Repeater>
                  </PieChart>
               </Svg>
            </div>
         </div>
         `}</CodeSnippet>
      </CodeSplit>
      
      ## Examples
      
      * [Multilevel](~/examples/charts/pie/multilevel)

      ## `PieChart` Configuration

      <ConfigTable props={pieConfigs} />

      ## `PieSlice` Configuration

      <ConfigTable props={sliceConfigs} />

   </Md>
</cx>

