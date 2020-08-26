import { HtmlElement, Repeater } from 'cx/widgets';
import { Controller, KeySelection, HoverSync } from 'cx/ui';
import { Svg, Text, Rectangle, Line } from 'cx/svg';
import { PieChart, PieSlice, Legend, ColorMap, Bar, Chart, Gridlines, NumericAxis, CategoryAxis } from 'cx/charts';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {ConfigTable} from 'docs/components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';

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

export const HoverSyncPage = <cx>
   <Md>
      <CodeSplit>
         # HoverSync

         <ImportPath path="import { HoverSync } from 'cx/ui';" />

         Pie charts are commonly used to compare parts to the whole. In Cx, pie charts are implemented using `PieChart` and
         `PieSlice`.

         <div class="widgets" controller={PageController}>
         <HoverSync>
            <Legend />
            <div>
               <Svg style="width:600px; height:300px;">
                  <ColorMap />
                  <PieChart angle={360} anchors="0 0.5 1 0">
                     <Repeater records-bind="$page.points">
                        <PieSlice
                            value-bind='$record.value'
                            colorMap="pie"
                            r={80}
                            r0={20}
                            offset={5}
                            hoverId-bind="$record.id"
                            innerPointRadius={80}
                            outerPointRadius={90}
                            name-bind="$record.name"
                            selection={{
                                type: KeySelection,
                                bind: '$page.selection',
                                records: {bind: '$page.points'},
                                record: {bind: '$record'},
                                index: {bind: '$index'},
                                keyField: 'id'
                            }}
                        />
                     </Repeater>
                  </PieChart>

                  <Chart
                    anchors="0 1 1 0.5"
                    offset="10 -10 -20 50"
                    axes={{
                        x: { type: NumericAxis, snapToTicks: 0 },
                        y: { type: CategoryAxis, vertical: true, snapToTicks: 1 }
                    }}
                >
                    <Gridlines />
                    <Repeater records-bind="$page.points">
                       <Bar
                            name-bind="$record.name"
                            x-bind="$record.value"
                            y-bind="$record.name"
                            colorMap="pie"
                            hoverId-bind="$record.id"
                            size={0.5}
                            selection={{
                                type: KeySelection,
                                bind: '$page.selection',
                                records: {bind: '$page.points'},
                                record: {bind: '$record'},
                                index: {bind: '$index'},
                                keyField: 'id'
                            }}
                        />
                    </Repeater>
                 </Chart>


               </Svg>
            </div>
            </HoverSync>
         </div>

         <CodeSnippet putInto="code" fiddle="9C63P156">{`

         `}</CodeSnippet>
      </CodeSplit>
   </Md>
</cx>

