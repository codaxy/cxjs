import { NumberField, Slider, TextField, Grid, HtmlElement } from 'cx/widgets';
import { LineGraph, NumericAxis, Chart } from 'cx/charts';
import { Svg } from 'cx/svg';
import { Controller } from 'cx/ui';

class Something extends Controller {
   init() {
      this.store.init('data', Array.from({length: 18}, (x, i)=>Object.assign({
         id: i,
         name: 'XXX',
         target: Math.random() * 10 - 5
      }, this.generateTrend())));
   }

   generateTrend() {
      let v = 1, s = 0;
      let trend = Array.from({length: 20}, (_, i)=> {
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
   <div controller={Something}>
      <Grid records:bind="data"
            style="height:600px"
            scrollable
            lockColumnWidths
            keyField="id"
            defaultSortField="sales"
            defaultSortDirection="DESC"
            columns={[
               { field: 'name', header: 'Name', sortable: true, aggregate: "count", footer: { tpl: "{$group.name} countries" } },
               {
                  header: 'Trend',
                  pad: false,
                  items: <cx>
                     <Svg style="width:100px;height:20px">
                        <Chart axes={{
                           x: { type: NumericAxis, hidden: true },
                           y: { type: NumericAxis, vertical: true, hidden: true, min: 0 }
                        }}>
                           <LineGraph data:bind="$record.trend" />
                        </Chart>
                     </Svg>
                  </cx>
               },
               { field: 'baseline', header: 'Baseline', format:"currency;EUR;0", align: "right", sortable: true, aggregate:'sum' },
               {
                  field: 'change',
                  header: 'Change',
                  format:"p;2",
                  align: "right",
                  sortable: true,
                  aggregate: 'avg',
                  weightField: 'baseline',
                  style: {
                     color: { expr: '{$record.change} > 0 ? "green" : "red"' }
                  }
               },
               {
                  field: 'sales',
                  header: {
                     text: 'Sales',
                     colSpan: 2,
                     align: 'center'
                  },
                  style: "width: 100px",
                  format:"currency;EUR;0",
                  align: "right",
                  sortable: true,
                  aggregate:'sum'
               },
               {
                  aggregate: 'max',
                  field: 'sales',
                  sortable: true,
                  aggregateField: 'maxSales',
                  footer: false,
                  style: "width: 100px",
                  items: <cx>
                     <div class="gridbar" style="width:100%;position:relative">
                        <div class="gridbar-bar" style={{
                           width: { tpl: '{[{$record.sales}/{$group.maxSales}]:p;2}' },
                           height: '10px',
                           background: 'lightsteelblue'
                        }} />
                     </div>
                  </cx>
               },
               {
                  header: {
                     text: "Target",
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
                     <NumberField value:bind="$record.target" format="ps;2" style="width:70px;" inputStyle="text-align:center"/>
                  </cx>
               },
               {
                  style: 'width: 100px',
                  pad: true,
                  items: <cx>
                     <Slider value:bind="$record.target" min={-50} max={50} style="width:100px;" />
                  </cx>
               },
               {
                  header: "Target",
                  value: { expr: '{$record.baseline} * (100 + {$record.target}) / 100' }, //SORT BUG
                  format: 'currency;USD;0',
                  align: 'right',
                  sortable: true,
                  aggregate: 'sum',
                  field: 'target2'
               }
            ]}>
      </Grid>
   </div>
</cx>;
