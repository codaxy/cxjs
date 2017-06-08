import {cx, Section, FlexRow, Repeater} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import { PieChart, PieSlice, Legend, ColorMap } from 'cx/charts';
import {Svg, Line, Rectangle, Text} from 'cx/svg';

class PageController extends Controller {
   init() {
      super.init();
      var value = 100;
      this.store.set('standard.points', Array.from({length: 7}, (_, i) => ({
         id: i,
         name: 'Item ' + (i+1),
         value: value = (value + (Math.random() - 0.5) * 30),
      })));

      this.store.set('multilevel.points', Array.from({length: 7}).map((_, i) => {
         var value = 20 + Math.random() * 100;
         return {
            x: i * 5,
            v: value,
            slices: Array.from({length: 5}).map(x=>({sv: value / 5}))
         }
      }));
   }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/pie-chart/states.tsx" target="_blank" putInto="github">GitHub</a>
    <FlexRow wrap spacing='large' target='desktop' controller={PageController} >
        <Section mod="well" title="Standard" hLevel={4} >
            <Legend.Scope>
                <Legend />
                <Svg style="width:600px; height:400px;">
                   <ColorMap />
                   <PieChart angle={360}>
                      <Repeater records={bind("standard.points")}>
                         <PieSlice value={bind('$record.value')}
                                   active={bind('$record.active')}
                                   colorMap="pie"
                                   r={80}
                                   r0={20}
                                   offset={5}
                                   tooltip={{
                                       text: {
                                           tpl: "Item {$index}: {$record.value:n;2}"
                                       },
                                       trackMouse: true
                                   }}
                                   innerPointRadius={80}
                                   outerPointRadius={90}
                                   name={tpl("Item {$index}")}
                                   selection={{
                                      type: KeySelection,
                                      bind: 'standard.selection',
                                      records: {bind: 'standard.points'},
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
            </Legend.Scope>
        </Section>
        <Section mod="well" title="Multi-level" hLevel={4} >
            <Legend.Scope>
                <Legend />
                <Svg style="width:400px; height:400px;">
                   <PieChart angle={360}>
                      <Repeater records={bind("multilevel.points")}>
                         <PieSlice value={bind('$record.v')}
                                    active={bind('$record.active')}
                                     colorIndex={expr('{$index} * 3 % 16')}
                                     r={55}
                                     r0={20}
                                     offset={3}
                                     name={tpl("Item {$index}")}
                                     selection={{
                                        type: KeySelection,
                                        bind:'multilevel.selection',
                                        records: {bind:'multilevel.points'},
                                        record: {bind:'$record'},
                                        index: {bind:'$index'},
                                        keyField: 'x'
                                     }}>
                         </PieSlice>
                         <Repeater records={bind("$record.slices")} recordName="$slice" indexName="$sliceIndex">
                            <PieSlice value={bind('$slice.sv')}
                                       active={bind('$record.active')}
                                       colorIndex={expr('{$index} * 3 % 16')}
                                       r={90}
                                       r0={58}
                                       offset={3}
                                       name={tpl("Slice {$sliceIndex}")}
                                       legend={expr("{multilevel.selection} == {$record.x} ? 'slice' : false")}
                                       stack="outer"
                                       style={{
                                        fillOpacity: {expr: '0.3 + 0.7 * ({$sliceIndex} / 4)'}
                                       }}
                                       selection={{
                                           type: KeySelection,
                                           bind:'multilevel.selection',
                                           records: {bind:'multilevel.points'},
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
            </Legend.Scope>
        </Section>
    </FlexRow>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);