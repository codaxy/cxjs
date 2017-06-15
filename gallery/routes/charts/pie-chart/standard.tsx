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
   }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/pie-chart/states.tsx" target="_blank" putInto="github">Source Code</a>
    <Section mod="well">
        <FlexRow direction="column" style="max-width:600px" controller={PageController} >
            <Legend />
            <Svg style="min-height:320px; height:566px;">
               <ColorMap />
               <PieChart angle={360} >
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
                           <Rectangle anchors='1 1 1 1' offset="-10 20 10 -20" mod="cover" >
                              <Text tpl="{$record.value:n;1}" dy="0.4em" ta="middle" />
                           </Rectangle>
                        </PieSlice>
                  </Repeater>
               </PieChart>
            </Svg>
        </FlexRow>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);