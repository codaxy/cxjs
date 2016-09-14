import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {CategoryAxis} from 'cx/ui/svg/charts/axis/CategoryAxis';
import {Grid} from 'cx/ui/grid/Grid';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Columns} from 'cx/ui/svg/charts/series/Columns';
import {Column} from 'cx/ui/svg/charts/series/Column';
import {Marker} from 'cx/ui/svg/charts/series/Marker';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Text} from 'cx/ui/svg/Text';
import {Repeater} from 'cx/ui/Repeater';
import {KeySelection} from 'cx/ui/selection/KeySelection';

var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 100;

      this.store.set('$page.points', Array.from({length: categories.length}, (_, i) => ({
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


export const Combination = <cx>
   <Md controller={PageController}>
      # Column Chart Example

      This example shows how a chart and a grid can be in sync using the same data. Handles on the chart
      can be used to tweak chart values and changes are automatically reflected in the grid.

      <CodeSplit>

         <div class="widgets">
            <div>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -20 -40 40" axes={{ x: { type: CategoryAxis }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
                     <Gridlines/>
                     <Repeater records:bind="$page.points" recordName="$point">
                        <Column colorIndex:expr="{$index}"
                                width={0.5}
                                offset={0}
                                x:bind="$point.x"
                                y:bind="$point.v1"
                                tooltip:tpl="{$point.x} {$point.v1:n}"
                                selection={columnSelection} />

                        <Column colorIndex:expr="{$index}+2"
                                width={0.5}
                                offset={0}
                                x:bind="$point.x"
                                y0:bind="$point.v1"
                                y:bind="$point.v2"
                                tooltip="X2"
                                selection={columnSelection} />

                        <Marker x:bind="$point.x"
                                y:bind="$point.v1"
                                xOffset={0}
                                size={10}
                                colorIndex:expr="{$index}"
                                style="cursor:move;"
                                draggableY>
                           <Rectangle anchors="0 1 0 0"
                                      offset="-30 10 -10 -10"
                                      style="fill:rgba(255, 255, 255, 0.8);stroke:#ccc">
                              <Text tpl="{$point.v1:n;0}" ta="middle" dy="0.4em" />
                           </Rectangle>
                        </Marker>
                        <Marker x:bind="$point.x"
                                y:bind="$point.v2"
                                xOffset={0}
                                size={10}
                                colorIndex:expr="{$index}+2"
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
               <Grid records:bind="$page.points"
                     columns={[
                        { header: 'Month', field: 'x' },
                        { header: 'V1', field: 'v1', format: 'n', align: "right" },
                        { header: 'V2', field: 'v2', format: 'n', align: "right" },
                        { header: 'Delta', value: { expr: "{$record.v2}-{$record.v1}" }, format: 'n', align: "right" },
                     ]}
                     selection={{type: KeySelection, keyField: 'x', bind: '$page.selection' }}/>
            </div>
         </div>

         <CodeSnippet putInto="code">{`
         var categories = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

         class PageController extends Controller {
            init() {
               super.init();
               var v1 = 100;

               this.store.set('$page.points', Array.from({length: categories.length}, (_, i) => ({
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
         ...
         <Svg style="width:600px; height:400px;">
            <Chart offset="20 -20 -40 40" axes={{ x: { type: CategoryAxis }, y: { type: NumericAxis, vertical: true, snapToTicks: 0 } }}>
               <Gridlines/>
               <Repeater records:bind="$page.points" recordName="$point">
                  <Column colorIndex:expr="{$index}"
                          width={0.5}
                          offset={0}
                          x:bind="$point.x"
                          y:bind="$point.v1"
                          tooltip:tpl="{$point.x} {$point.v1:n}"
                          selection={columnSelection} />

                  <Column colorIndex:expr="{$index}+2"
                          width={0.5}
                          offset={0}
                          x:bind="$point.x"
                          y0:bind="$point.v1"
                          y:bind="$point.v2"
                          tooltip="X2"
                          selection={columnSelection} />

                  <Marker x:bind="$point.x"
                          y:bind="$point.v1"
                          xOffset={0}
                          size={10}
                          colorIndex:expr="{$index}"
                          style="cursor:move;"
                          draggableY>
                     <Rectangle anchors="0 1 0 0"
                                offset="-30 10 -10 -10"
                                style="fill:rgba(255, 255, 255, 0.8);stroke:#ccc">
                        <Text tpl="{$point.v1:n;0}" ta="middle" dy="0.4em" />
                     </Rectangle>
                  </Marker>
                  <Marker x:bind="$point.x"
                          y:bind="$point.v2"
                          xOffset={0}
                          size={10}
                          colorIndex:expr="{$index}+2"
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
         <Grid records:bind="$page.points"
               columns={[
                  { header: 'Month', field: 'x' },
                  { header: 'V1', field: 'v1', format: 'n', align: "right" },
                  { header: 'V2', field: 'v2', format: 'n', align: "right" },
                  { header: 'Delta', value: { expr: "{$record.v2}-{$record.v1}" }, format: 'n', align: "right" },
               ]}
               selection={{type: KeySelection, keyField: 'x', bind: '$page.selection' }}/>
         `}</CodeSnippet>
      </CodeSplit>
   </Md>
</cx>;

