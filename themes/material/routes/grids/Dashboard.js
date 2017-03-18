import { MarkerLine, LineGraph, NumericAxis, Chart } from 'cx/charts';
import { NumberField, Slider, TextField, Grid, HtmlElement, Section } from 'cx/widgets';
import { Svg } from 'cx/svg';
import { Controller } from 'cx/ui';

import {casual} from 'shared/data/casual';

class Dashboard extends Controller {
   init() {
      this.store.init('$page.dashboard', Array.from({length: 18}, (x, i) => Object.assign({
         id: i,
         name: casual.country,
         target: Math.random() * 20 - 5
      }, this.generateTrend())));
   }

   generateTrend() {
      let v = 1, s = 0;
      let trend = Array.from({length: 20}, (_, i) => {
         v = Math.max(0, v + (Math.random() - 0.5) * 0.5);
         s += v;
         return {
            x: i,
            y: v
         }
      });

      let baseline = Math.random() * 1e6;
      return {
         trend,
         change: s / 20 - 1,
         baseline,
         sales: baseline * s / 20
      }
   }
}

export default <cx>
   <div controller={Dashboard}>
      <Grid records:bind="$page.dashboard"
         lockColumnWidths
         style={{height: "450px"}}
         scrollable
         keyField="id"
         defaultSortField="sales"
         defaultSortDirection="DESC"
         mod="responsive"
         columns={[
            {
               field: 'name',
               header: 'Name',
               sortable: true,
               aggregate: "count",
               footer: {tpl: "{$group.name} countries"}
            },

            {
               field: 'sales',
               header: {
                  text: 'Sales',
                  colSpan: 2,
                  align: 'center'
               },
               style: "width: 100px",
               format: "currency;EUR;0",
               align: "right",
               sortable: true,
               aggregate: 'sum'
            },

            {
               aggregate: 'max',
               field: 'sales',
               sortable: true,
               aggregateField: 'maxSales',
               footer: false,
               style: "width: 100px",
               items: <cx>
                  <div style="width:100%;position:relative">
                     <div style={{
                        width: {tpl: '{[{$record.sales}/{$group.maxSales}]:p;2}'},
                        height: '10px',
                        background: 'lightsteelblue'
                     }}/>
                  </div>
               </cx>
            }, {
               field: 'change',
               header: 'Change',
               format: "p;2",
               align: "right",
               sortable: true,
               aggregate: 'avg',
               weightField: 'baseline',
               style: {
                  color: {expr: '{$record.change} > 0 ? "green" : "red"'}
               }
            }, {
               header: {
                  text: "Target (%)",
                  colSpan: 2,
                  align: 'center'
               },
               field: 'target',
               style: 'width: 70px',
               aggregate: 'avg',
               weightField: 'baseline',
               format: 'ps;2',
               sortable: true,
               align: 'center',
               items: <cx>
                  <NumberField value:bind="$record.target"
                     format="ps;2"
                     style="width:70px;"
                     inputStyle="text-align:center"/>
               </cx>
            },
            {
               style: 'width: 100px',
               pad: true,
               items: <cx>
                  <Slider value:bind="$record.target"
                     min={-20}
                     max={20}
                     style="width:300px;"/>
               </cx>
            },
            {
               header: "Target",
               value: {expr: '{$record.baseline} * (100 + {$record.target}) / 100'}, //SORT BUG
               format: 'currency;USD;0',
               align: 'right',
               sortable: true,
               aggregate: 'sum',
               field: 'target2'
            }, {
               field: 'baseline',
               header: 'Baseline',
               format: "currency;EUR;0",
               align: "right",
               sortable: true,
               aggregate: 'sum'
            }, {
               header: 'Trend',
               pad: false,
               items: <cx>
                  <Svg style="width:100px;height:20px">
                     <Chart axes={{
                        x: {type: NumericAxis, hidden: true},
                        y: {type: NumericAxis, vertical: true, hidden: true, min: 0}
                     }}>
                        <MarkerLine y:expr="1+{$record.target}/100" colorIndex={0}/>
                        <LineGraph data:bind="$record.trend"/>
                     </Chart>
                  </Svg>
               </cx>
            },
         ]}>
      </Grid>
   </div>
</cx>;

