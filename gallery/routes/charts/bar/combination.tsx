import {cx, Section, FlexRow, Repeater, Grid} from 'cx/widgets';
import {bind, expr, tpl, Controller, PropertySelection} from 'cx/ui';
import {Chart, NumericAxis, CategoryAxis, Gridlines, Bar, Legend} from 'cx/charts';
import {Svg} from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 100;

      this.store.init('$page.points', Array.from({length: 12}, (_, i) => ({
         id: i,
         city: casual.city,
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v1 + 50 + Math.random() * 100,
         v3: v1 + 50 + Math.random() * 100,
         selected: false
      })));
   }
}

var barSelection = new PropertySelection({
   keyField: 'id',
   bind: '$page.selection',
   record: { bind: '$point' },
   index: { bind: '$index' },
   records: { bind: '$page.points' }
});

var legendStyle = { 
    borderWidth: '1px',
    borderStyle: 'solid',
    display: 'inline-block',
    width: '20px',
    height: '10px', 
    margin: '0 3px'
};

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/bar/combination.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController}>
        <FlexRow direction="column" align="left" >
            <Svg style="height:600px;">
               <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 1 } }}>
                  <Gridlines/>
                  <Repeater records={bind("$page.points")} recordName="$point" sorters={bind("$page.sorters")}>
                     <Bar colorIndex={0}
                          height={0.2}
                          offset={-0.2}
                          x={bind("$point.v1")}
                          y={bind("$point.city")}
                          selection={barSelection}
                          tooltip={tpl("{$point.v1:n;0}")} />
                      
                     <Bar colorIndex={2}
                          height={0.2}
                          offset={0}
                          x={bind("$point.v2")}
                          y={bind("$point.city")}
                          selection={barSelection}
                          tooltip={tpl("{$point.v2:n;0}")} />
                      
                     <Bar colorIndex={4}
                          height={0.2}
                          offset={0.2}
                          x={bind("$point.v3")}
                          y={bind("$point.city")}
                          selection={barSelection}
                          tooltip={tpl("{$point.v3:n;0}")} />
                  </Repeater>
               </Chart>
            </Svg>
            <Grid records={bind("$page.points")}
                  sorters={bind("$page.sorters")}
                  scrollable
                  columns={[
                     { header: 'City', field: 'city', sortable: true },
                     { field: 'v1', format: 'n;2', align: "right", sortable: true,
                        header: {
                           items: <cx>
                              <div preserveWhitespace>
                                 V1
                                 <div className="cxs-color-0" style={legendStyle}></div>
                              </div>
                           </cx>
                        }
                     },
                     { field: 'v2', format: 'n;2', align: "right", sortable: true,
                        header: {
                           items: <cx>
                              <div preserveWhitespace>
                                  V2
                                  <div class="cxs-color-2" style={legendStyle}></div>
                              </div>
                           </cx>
                        }
                     },
                     { field: 'v3', format: 'n;2', align: "right", sortable: true,
                        header: {
                        items: <cx>
                           <div preserveWhitespace>
                               V3
                               <div class="cxs-color-4" style={legendStyle}></div>
                           </div>
                        </cx>
                        }
                     }
                  ]}
                  selection={{type: PropertySelection, keyField: 'id', bind: '$page.selection' }}/>
        </FlexRow>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);