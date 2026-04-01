import { cx, Section, FlexRow, Repeater, Checkbox, Grid } from 'cx/widgets';
import { bind, expr, tpl, Controller, KeySelection } from 'cx/ui';
import { Chart, Legend, LegendScope, Gridlines, LineGraph, CategoryAxis,
    NumericAxis, ColumnGraph, TimeAxis, Range, Marker, Column } from 'cx/charts';
import { Svg, Line, Rectangle, Text, ClipRect } from 'cx/svg';
import casual from '../../../util/casual';

var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.points', Array.from({length: 30}, (_, i) => ({
         x: casual.city,
         y: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10
      })));

      let v1 = 100;
      this.store.set('$page.points2', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: v1 = (v1 + (Math.random() - 0.5) * 30),
         v2: v1 + 50 + Math.random() * 100
      })));

      this.store.set('$page.points3', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: Math.random() * 30,
         v2: Math.random() * 30,
         v3: Math.random() * 30,
         a1: Math.random() * 30,
         a2: Math.random() * 30,
         a3: Math.random() * 30,
      })));

      v1 = 500;
      let v2 = 500;
      let v3 = 500;
      this.store.set('$page.points4', Array.from({length: 10}, (_, i) => ({
         x: 2000 + i,
         v1: v1 = v1 + (Math.random() - 0.5) * 100,
         v2: v2 = v2 + (Math.random() - 0.5) * 100,
         v3: v3 = v3 + (Math.random() - 0.5) * 100,
      })));

      this.store.set('$page.points5', Array.from({length: categories.length}, (_, i) => ({
         x: categories[i],
         v1: Math.random() * 30,
         v2: Math.random() * 30,
         v3: Math.random() * 30,
         a1: Math.random() * 30,
         a2: i < 7 ? Math.random() * 30 : null,
         a3: i < 10 ? Math.random() * 30 : null,
      })));
   }
}

var columnSelection = new KeySelection({
   keyField: 'x',
   bind: '$page.selection',
   record: { bind: '$point' },
   index: { bind: '$index' }
});

export default <cx>
    <FlexRow wrap spacing='large' target='desktop' controller={PageController} >
        
        <Section mod="well" title="Customized" hLevel={4} >
            <LegendScope>
                <Svg style="width:600px; height:400px;">
                   <Chart offset="20 -20 -140 40" axes={{
                      x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                      y: { type: NumericAxis, vertical: true } }}>
                      <Gridlines/>
                      <Repeater records={bind("$page.points")} recordName="$point">
                         <Column colorIndex={expr("15 - Math.round({$point.y}*6/50)")}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.y")}
                                 tooltip={tpl("{$point.x} {$point.y:n;0}")} />
                      </Repeater>
                   </Chart>
                </Svg>
                <Legend />
            </LegendScope>
        </Section>

        <Section mod="well" title="Normalized" hLevel={4} >
            <LegendScope>
                <Svg style="width:600px; height:400px;">
                   <Chart offset="20 -20 -40 40" axes={{
                         x: CategoryAxis,
                         y: { type: NumericAxis, vertical: true, normalized: true, format: 'p' }
                      }}>
                      <Gridlines/>
                      <Repeater records={bind("$page.points4")} recordName="$point">
                         <Column name="V1"
                                 active={bind("$page.normalized.v1")}
                                 colorIndex={0}
                                 x={bind("$point.x")}
                                 y={bind("$point.v1")}
                                 tooltip={tpl("V1 {$point.x} {$point.v1:n}")}
                                 stacked />
                             
                         <Column name="V2"
                                 active={bind("$page.normalized.v2")}
                                 colorIndex={2}
                                 x={bind("$point.x")}
                                 y={bind("$point.v2")}
                                 tooltip={tpl("V2 {$point.x} {$point.v2:n}")}
                                 stacked />
                             
                         <Column name="V3"
                                 active={bind("$page.normalized.v3")}
                                 colorIndex={4}
                                 x={bind("$point.x")}
                                 y={bind("$point.v3")}
                                 tooltip={tpl("V3 {$point.x} {$point.v3:n}")}
                                 stacked />
                             
                      </Repeater>
                   </Chart>          
                </Svg>
                <Legend />
            </LegendScope>
        </Section>

        <Section mod="well" title="Stacked" hLevel={4} >
            <LegendScope>
                <Svg style="width:600px; height:400px;">
                   <Chart offset="20 -20 -40 40" axes={{ x: { type: CategoryAxis }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
                      <Gridlines/>
                      <Repeater records={bind("$page.points3")} recordName="$point">
                         <Column name="V1"
                                 active={bind("$page.v1")}
                                 colorIndex={2}
                                 width={0.3}
                                 offset={-0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.v1")}
                                 tooltip={tpl("V1 {$point.x} {$point.v1:n}")}
                                 stack="v"
                                 stacked />
                             
                         <Column name="V2"
                                 active={bind("$page.v2")}
                                 colorIndex={1}
                                 width={0.3}
                                 offset={-0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.v2")}
                                 tooltip={tpl("V2 {$point.x} {$point.v2:n}")}
                                 stack="v"
                                 stacked />
                             
                         <Column name="V3"
                                 active={bind("$page.v3")}
                                 colorIndex={0}
                                 width={0.3}
                                 offset={-0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.v3")}
                                 tooltip={tpl("V3 {$point.x} {$point.v3:n}")}
                                 stack="v"
                                 stacked />
                             
                         <Column name="A1"
                                 active={bind("$page.a1")}
                                 colorIndex={11}
                                 width={0.3}
                                 offset={0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.a1")}
                                 tooltip={tpl("A1 {$point.x} {$point.a1:n}")}
                                 stack="a"
                                 stacked />
                             
                         <Column name="A2"
                                 active={bind("$page.a2")}
                                 colorIndex={12}
                                 width={0.3}
                                 offset={0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.a2")}
                                 tooltip={tpl("A2 {$point.x} {$point.a2:n}")}
                                 stack="a"
                                 stacked />
                             
                         <Column name="A3"
                                 active={bind("$page.a3")}
                                 colorIndex={13}
                                 width={0.3}
                                 offset={0.15}
                                 x={bind("$point.x")}
                                 y={bind("$point.a3")}
                                 tooltip={tpl("A3 {$point.x} {$point.a3:n}")}
                                 stack="a"
                                 stacked />
                             
                      </Repeater>
                   </Chart>
                </Svg>
                <Legend />
            </LegendScope>
        </Section>

        <Section mod="well" title="Auto-calculated Column Widths" hLevel={4} >
            <LegendScope>
                <Svg style="width:600px; height:400px;">
                   <Chart offset="20 -20 -40 40" axes={{
                         x: { type: CategoryAxis, uniform: true, labelAnchor: "end", labelRotation: -90, labelDy: '0.35em' },
                         y: { type: NumericAxis, vertical: true, snapToTicks: 0 }
                      }}>
                      <Gridlines/>
                      <Repeater records={bind("$page.points5")} recordName="$point">
                         <Column name="V1"
                                 active={bind("$page.autoWidth.v1")}
                                 colorIndex={2}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.v1")}
                                 tooltip={tpl("V1 {$point.x} {$point.v1:n}")}
                                 stack="v"
                                 stacked
                                 autoSize />
                             
                         <Column name="V2"
                                 active={bind("$page.autoWidth.v2")}
                                 colorIndex={1}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.v2")}
                                 tooltip={tpl("V2 {$point.x} {$point.v2:n}")}
                                 stack="v"
                                 stacked
                                 autoSize />
                             
                         <Column name="V3"
                                 active={bind("$page.autoWidth.v3")}
                                 colorIndex={0}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.v3")}
                                 tooltip={tpl("V3 {$point.x} {$point.v3:n}")}
                                 stack="z"
                                 stacked
                                 autoSize />
                             
                         <Column name="A1"
                                 active={bind("$page.autoWidth.a1")}
                                 colorIndex={11}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.a1")}
                                 tooltip={tpl("A1 {$point.x} {$point.a1:n}")}
                                 stack="x"
                                 stacked
                                 autoSize />
                             
                         <Column name="A2"
                                 active={bind("$page.autoWidth.a2")}
                                 colorIndex={12}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.a2")}
                                 tooltip={tpl("A2 {$point.x} {$point.a2:n}")}
                                 stack="a"
                                 stacked
                                 autoSize />
                             
                         <Column name="A3"
                                 active={bind("$page.autoWidth.a3")}
                                 colorIndex={13}
                                 width={0.8}
                                 x={bind("$point.x")}
                                 y={bind("$point.a3")}
                                 tooltip={tpl("A3 {$point.x} {$point.a3:n}")}
                                 stack="a"
                                 stacked
                                 autoSize />
                             
                      </Repeater>
                   </Chart>
                </Svg>
                <Legend />
            </LegendScope>
        </Section>

        <Section mod="well" title="Combination" hLevel={4} >
            <FlexRow direction="column">
            <Svg style="width:600px; height:400px; flex: 1;">
               <Chart offset="20 -20 -40 40" axes={{ x: { type: CategoryAxis }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
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
                                   style="fill:rgba(255, 255, 255, 0.8);stroke:#ccc">
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
                                   style="fill:rgba(255, 255, 255, 0.8);stroke:#ccc">
                           <Text tpl="{$point.v2:n;0}" ta="middle" dy="0.4em" />
                        </Rectangle>
                     </Marker>
                  </Repeater>
               </Chart>
            </Svg>
            <Grid style="flex: 1;"
                records={bind("$page.points2")}
                columns={[
                   { header: 'Month', field: 'x' },
                   { header: 'V1', field: 'v1', format: 'n', align: "right" },
                   { header: 'V2', field: 'v2', format: 'n', align: "right" },
                   { header: 'Delta', value: { expr: "{$record.v2}-{$record.v1}" }, format: 'n', align: "right" },
                ]}
                selection={{type: KeySelection, keyField: 'x', bind: '$page.selection' }}/>
            </FlexRow>
        </Section>


    </FlexRow>
</cx>

import { hmr } from '../../hmr.js';
 +hmr(module);