import { cx, Section, FlexRow, Repeater, Checkbox, Grid } from 'cx/widgets';
import { bind, expr, tpl, Controller, KeySelection } from 'cx/ui';
import { Chart, Legend, Gridlines, LineGraph, CategoryAxis, 
    NumericAxis, ColumnGraph, TimeAxis, Range, Marker, Column } from 'cx/charts';
import { Svg, Line, Rectangle, Text, ClipRect } from 'cx/svg';
import casual from '../../../util/casual';

var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class PageController extends Controller {
   init() {
      super.init();

      var v1 = 100;
      this.store.set('$page.points2', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v1 + 50 + Math.random() * 100
      })));

   }
}

var columnSelection = new KeySelection({
   keyField: 'x',
   bind: '$page.selection',
   record: { bind: '$point' },
   index: { bind: '$index' }
});

let mw = 768;

export default <cx>
    <a href="https://github.com/codaxy/cx/tree/master/gallery/routes/charts/column/combination.tsx" target="_blank" putInto="github">GitHub</a>
    <Section mod="well" controller={PageController} >
        <FlexRow target="desktop" style="min-width:400px;" spacing="xlarge">
            <Svg style="width:100%; min-height:535px; align-self:stretch; flex: 1.25;">
               <Chart offset="20 -20 -40 40" axes={{ 
                        x: window.innerWidth >= mw ? CategoryAxis : {type: CategoryAxis, labelAnchor: "end", labelRotation: -45, labelDy: '0.35em' },
                        y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
                  <Gridlines/>
                  <Repeater records={bind("$page.points2")} recordName="$point">
                     <Column colorIndex={expr("{$index}")}
                             width={0.5}
                             offset={0}
                             x={bind("$point.x")}
                             y={bind("$point.v1")}
                             tooltip={tpl("{$point.x} {$point.v1:n}")}
                             selection={columnSelection} />
                         
                     <Column colorIndex={expr("{$index}+2")}
                             width={0.5}
                             offset={0}
                             x={bind("$point.x")}
                             y0={bind("$point.v1")}
                             y={bind("$point.v2")}
                             tooltip="X2"
                             selection={columnSelection} />
                         
                     <Marker x={bind("$point.x")}
                             y={bind("$point.v1")}
                             xOffset={0}
                             size={10}
                             colorIndex={expr("{$index}")}
                             style="cursor:move;"
                             draggableY>
                        <Rectangle anchors="0 1 0 0"
                                   offset="-30 10 -10 -10"
                                   mod="cover">
                           <Text tpl="{$point.v1:n;0}" ta="middle" dy="0.4em" />
                        </Rectangle>
                     </Marker>
                     <Marker x={bind("$point.x")}
                             y={bind("$point.v2")}
                             xOffset={0}
                             size={10}
                             colorIndex={expr("{$index}+2")}
                             style="cursor:move;"
                             draggableY >
                        <Rectangle anchors="0 1 0 0"
                                   offset="-30 10 -10 -10"
                                   mod="cover">
                           <Text tpl="{$point.v2:n;0}" ta="middle" dy="0.4em" />
                        </Rectangle>
                     </Marker>
                  </Repeater>
               </Chart>
            </Svg>
            <Grid style="flex: 0.75;"
                records={bind("$page.points2")}
                columns={[
                   { header: 'Month', field: 'x' },
                   { header: 'V1', field: 'v1', format: 'n;2', align: "right" },
                   { header: 'V2', field: 'v2', format: 'n;2', align: "right" },
                   { header: 'Delta', value: { expr: "{$record.v2}-{$record.v1}" }, format: 'n;2', align: "right" },
                ]}
                selection={{type: KeySelection, keyField: 'x', bind: '$page.selection' }}
                scrollable
            />
        </FlexRow>
    </Section>
</cx>

import { hmr } from '../../hmr.js';
 +hmr(module);