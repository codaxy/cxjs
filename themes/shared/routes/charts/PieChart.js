import { KeySelection, Controller } from 'cx/ui';
import { Text, Rectangle, Line, Svg } from 'cx/svg';
import { Repeater, HtmlElement } from 'cx/widgets';
import { PieChart, PieSlice, ColorMap, Legend } from 'cx/charts';

class PageController extends Controller {
   init() {
      super.init();
      var value = 100;
      this.store.set('$page.pie', Array.from({length: 7}, (_, i) => ({
         id: i,
         name: 'Item ' + (i+1),
         value: value = (value + (Math.random() - 0.5) * 30),
      })));
   }
}

export default <cx>
   <div style="flex:1" controller={PageController}>
      <Legend />

         <Svg style="width:100%;height:400px;min-width:350px;">
            <ColorMap />
            <PieChart angle={360}>
               <Repeater records:bind="$page.pie">
                  <PieSlice value:bind='$record.value'
                     active:bind='$record.active'
                     colorMap="pie"
                     r:expr='80'
                     r0:expr='20'
                     offset={5}
                     tooltip={{
                        text: {
                           tpl: "Item {$index}: {$record.value:n;2}"
                        },
                        trackMouse: true
                     }}
                     innerPointRadius={80}
                     outerPointRadius={90}
                     name:tpl="Item {$index}"
                     selection={{
                        type: KeySelection,
                        bind: '$page.selection',
                        records: {bind: '$page.pie'},
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
</cx>