import { KeySelection, Controller } from 'cx/ui';
import { CategoryAxis, NumericAxis, Legend, BarGraph, Gridlines, Chart } from 'cx/charts';
import { Svg } from 'cx/svg';
import { HtmlElement } from 'cx/widgets';

import {casual} from 'shared/data/casual';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 100;
      var v2 = 110;
      this.store.set('$page.bars', Array.from({length: 11}, (_, i) => ({
         y: casual.city,
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v2 = (v2 + (Math.random() - 0.5) * 30)
      })));
   }
}
export default <cx>
   <Legend.Scope controller={PageController}>
      <Svg style="width:100%; height:400px;min-width:350px;">
         <Chart offset="20 -20 -30 150" axes={{
            x: { type: NumericAxis, snapToTicks: 1 },
            y: { type: CategoryAxis, vertical: true }
         }}>
            <Gridlines/>
            <BarGraph data:bind="$page.bars"
               colorIndex={0}
               name="V1"
               size={0.3}
               offset={-0.15}
               xField="v1"
               selection={{
                  type: KeySelection,
                  bind: '$page.selected.y',
                  keyField: 'y'
               }}
            />

            <BarGraph data:bind="$page.bars"
               colorIndex={6}
               name="V2"
               size={0.3}
               offset={+0.15}
               xField="v2"
               selection={{
                  type: KeySelection,
                  bind: '$page.selected.y',
                  keyField: 'y'
               }}/>
         </Chart>
      </Svg>
      <Legend />
   </Legend.Scope>
</cx>