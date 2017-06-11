import {cx, Section, FlexRow, Repeater} from 'cx/widgets';
import {bind, expr, tpl, Controller, KeySelection} from 'cx/ui';
import {Chart, NumericAxis, CategoryAxis, Gridlines, Bar, Legend} from 'cx/charts';
import {Svg} from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 200;
      var w1 = 200;

      this.store.init('$page.points', Array.from({length: 15}, (_, i) => ({
         id: i,
         city: casual.city,
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v1 + 50 + Math.random() * 100,
         v3: v1 + 50 + Math.random() * 100,
         w1: -(w1 = (w1 + (Math.random() - 0.5) * 30)),
         w2: -(w1 + 50 + Math.random() * 100),
         w3: -(w1 + 50 + Math.random() * 100),
      })));
   }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/bar/stacked.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController}>
        <FlexRow direction="column" >
            <Svg style="height:600px;">
               <Chart offset="20 -20 -40 150" axes={{ y: { type: CategoryAxis, vertical: true, inverted: true }, x: { type: NumericAxis, snapToTicks: 0 } }}>
                  <Gridlines/>
                  <Repeater records={bind("$page.points")} recordName="$point" sorters={bind("$page.sorters")}>
              
                     <Bar name="V1"
                          colorIndex={8}
                          active={bind("$page.v1")}
                          height={0.5}
                          x={bind("$point.v1")}
                          y={bind("$point.city")}
                          stacked
                          tooltip={tpl("{$point.v1:n;0}")} />
                      
                     <Bar name="V2"
                          colorIndex={9}
                          active={bind("$page.v2")}
                          height={0.5}
                          x={bind("$point.v2")}
                          y={bind("$point.city")}
                          stacked
                          tooltip={tpl("{$point.v2:n;0}")} />
                      
                      
                     <Bar name="V3"
                          colorIndex={10}
                          active={bind("$page.v3")}
                          height={0.5}
                          x={bind("$point.v3")}
                          y={bind("$point.city")}
                          stacked
                          tooltip={tpl("{$point.v3:n;0}")} />
                      
                      
                     <Bar name="W1"
                          colorIndex={2}
                          active={bind("$page.w1")}
                          height={0.5}
                          x={bind("$point.w1")}
                          y={bind("$point.city")}
                          stacked
                          stack="left"
                          tooltip={tpl("{$point.w1:n;0}")} />
                      
                     <Bar name="W2"
                          colorIndex={1}
                          active={bind("$page.w2")}
                          height={0.5}
                          x={bind("$point.w2")}
                          y={bind("$point.city")}
                          stacked
                          stack="left"
                          tooltip={tpl("{$point.w2:n;0}")} />
                      
                     <Bar name="W3"
                          colorIndex={0}
                          active={bind("$page.w3")}
                          height={0.5}
                          x={bind("$point.w3")}
                          y={bind("$point.city")}
                          stacked
                          stack="left"
                          tooltip={tpl("{$point.w3:n;0}")} />
                  </Repeater>
               </Chart>
            </Svg>
            <Legend />
        </FlexRow>
    </Section>
</cx>

import {hmr} from '../../hmr.js';
hmr(module);