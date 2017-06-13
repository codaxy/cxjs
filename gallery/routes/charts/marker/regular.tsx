import { cx, Section, FlexRow, Repeater } from 'cx/widgets';
import { bind, expr, tpl, Controller, KeySelection } from 'cx/ui';
import { Range, Chart, NumericAxis, Gridlines, LineGraph, Marker, Legend } from 'cx/charts';
import { Svg, Text } from 'cx/svg';
import casual from '../../../util/casual';

class PageController extends Controller {
   init() {
      super.init();
      this.store.set('$page.reds', Array.from({length: 50}, (_, i) => ({
         x: 100+Math.random() * 300,
         y: Math.random() * 300,
         size: 10 + Math.random() * 30,
         color: Math.floor(Math.random() * 3)
      })));
      this.store.set('$page.blues', Array.from({length: 50}, (_, i) => ({
         x: Math.random() * 300,
         y: 100 + Math.random() * 300,
         size: 10 + Math.random() * 30,
         color: 4 + Math.floor(Math.random() * 3)
      })));
   }
}

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/marker/regular.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController} style="height: 100%; display: flex;">
        <FlexRow direction="column" >
            <Svg style="width:100%; height:500px;">
               <Chart offset="20 -20 -40 40" axes={{
                  x: { type: NumericAxis, snapToTicks: 1 },
                  y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
               }}>
                  <Gridlines/>
                  <Repeater records={bind("$page.reds")} recordName="$point">
                     <Marker colorIndex={bind("$point.color")}
                            legendColorIndex={1}
                            active={bind("$page.showReds")}
                            name="Reds"
                            size={bind("$point.size")}
                            x={bind("$point.x")}
                            y={bind("$point.y")}
                            tooltip={tpl("Red ({$point.x:n;0}, {$point.y:n;0})")}
                            style={{fillOpacity: 0.5}}
                            draggableX draggableY
                     />
                  </Repeater>
                  <Repeater records={bind("$page.blues")} recordName="$point">
                     <Marker colorIndex={bind("$point.color")}
                            legendColorIndex={5}
                            active={bind("$page.showBlues")}
                            name="Blues"
                            size={bind("$point.size")}
                            x={bind("$point.x")}
                            y={bind("$point.y")}
                            tooltip={tpl("Blue ({$point.x:n;0}, {$point.y:n;0})")}
                            style={{fillOpacity: 0.5}}
                            draggableX draggableY/>
                  </Repeater>
               </Chart>
            </Svg>
            <Legend />
        </FlexRow>
    </Section>
</cx >

import { hmr } from '../../hmr.js';
hmr(module);