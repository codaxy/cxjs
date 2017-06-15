import {cx, Section, FlexRow, Repeater} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import { PieChart, PieSlice, Legend, ColorMap } from 'cx/charts';
import {Svg, Line, Rectangle, Text} from 'cx/svg';

class PageController extends Controller {
   init() {
      super.init();
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
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/pie-chart/states.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well" >
        <FlexRow direction="column" style="max-width:600px" controller={PageController} >
            <Legend />
            <Svg style="min-height:320px; height:566px;">
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
            <Legend name="slice" />
        </FlexRow>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);