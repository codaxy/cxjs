import {cx, Section, FlexRow, Repeater} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import {Chart, NumericAxis, CategoryAxis, Gridlines, Bar, Legend} from 'cx/charts';
import {Svg} from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 200;

      this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
         id: i,
         city: casual.city,
         max: v1 = 0.95 * v1,
         value: (0.5 + 0.5 * Math.random()) * v1
      })));
   }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/bar/bullets.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController}>
        <FlexRow direction="column" style="min-width:400px; max-width:600px;">
            <Svg style="width:100%; height:600px;">
               <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 0 } }}>
                  <Repeater records={bind("$page.points")} recordName="$point" sorters={bind("$page.sorters")}>
                     <Bar colorIndex={10}
                          style="stroke:none;opacity:0.3"
                          x={bind("$point.max")}
                          y={bind("$point.city")} />
                        
                      <Bar colorIndex={8}
                          style="stroke:none;opacity:0.3"
                          x={expr("0.8*{$point.max}")}
                          y={bind("$point.city")} />
                        
                      <Bar colorIndex={4}
                          style="stroke:none;opacity:0.3"
                          x={expr("0.6*{$point.max}")}
                          y={bind("$point.city")} />
                        
                      <Bar style="fill:#555"
                          height={0.2}
                          x={bind("$point.value")}
                          y={bind("$point.city")} />
                        
                      <Bar style="stroke:red;stroke-width:1px"
                          height={0.5}
                          x={expr("0.7*{$point.max}")}
                          x0={expr("0.7*{$point.max}")}
                          y={bind("$point.city")} />
                        
                   </Repeater>
                  <Gridlines yAxis={false} />
               </Chart>
            </Svg>
        </FlexRow>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);