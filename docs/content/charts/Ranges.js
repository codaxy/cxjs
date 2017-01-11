import { HtmlElement } from 'cx/widgets';
import { Controller } from 'cx/ui';
import { Svg, Text } from 'cx/svg';
import { Gridlines, Range, Marker, NumericAxis, Chart, LineGraph, Legend } from 'cx/charts';
import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';
import {ImportPath} from 'docs/components/ImportPath';



import configs from './configs/Range';

class PageController extends Controller {
   init() {
      super.init();
      var y = 200;
      this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y: y = y + (Math.random() - 0.4) * 30
      })));

      this.store.set('$page.p1', { x: 150, y: 250 });
      this.store.set('$page.p2', { x: 250, y: 350 });
   }
}


export const Ranges = <cx>
   <Md>
      # Range

      <ImportPath path="import {Range} from 'cx/charts';" />

      The `Range` component can be used to highlight important zones on the chart.

      <CodeSplit>
         <div class="widgets" controller={PageController}>
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <Range x1:bind="$page.p1.x" x2:bind="$page.p2.x" colorIndex={11} name="X Range" active:bind="$page.yrange">
                     <Text anchors="0 0.5 0 0.5" offset="5 0 0 0" ta="middle" dy="0.8em">X Range</Text>
                  </Range>
                  <Range y1:bind="$page.p1.y" y2:bind="$page.p2.y" colorIndex={8} name="Y Range" active:bind="$page.xrange">
                     <Text anchors="0.5 0 0.5 0" dy="0.4em" dx={5}>Y Range</Text>
                  </Range>
                  <LineGraph data:bind="$page.points" colorIndex={0}  />
                  <Marker colorIndex={11} x:bind="$page.p1.x" size={10} draggableX  />
                  <Marker colorIndex={11} x:bind="$page.p2.x" size={10} draggableX  />
                  <Marker colorIndex={8} y:bind="$page.p1.y" size={10} draggableY />
                  <Marker colorIndex={8} y:bind="$page.p2.y" size={10} draggableY />
               </Chart>
            </Svg>
            <Legend />
         </div>

         <CodeSnippet putInto="code" fiddle="gFt6i4Vb">{`
            class PageController extends Controller {
               init() {
                  super.init();
                  var y = 100;
                  this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
                     x: i * 4,
                     y: y = y + (Math.random() - 0.4) * 30
                  })));

                  this.store.set('$page.p1', { x: 150, y: 250 });
                  this.store.set('$page.p2', { x: 250, y: 350 });
               }
            }
            ...
            <div class="widgets" controller={PageController}>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                     <Gridlines/>
                     <Range x1:bind="$page.p1.x" x2:bind="$page.p2.x" colorIndex={11} name="X Range" active:bind="$page.yrange">
                        <Text anchors="0 0.5 0 0.5" offset="5 0 0 0" ta="middle" dy="0.8em">X Range</Text>
                     </Range>
                     <Range y1:bind="$page.p1.y" y2:bind="$page.p2.y" colorIndex={8} name="Y Range" active:bind="$page.xrange">
                        <Text anchors="0.5 0 0.5 0" dy="0.4em" dx={5}>Y Range</Text>
                     </Range>
                     <LineGraph data:bind="$page.points" colorIndex={0}  />
                     <Marker colorIndex={11} x:bind="$page.p1.x" size={10} draggableX  />
                     <Marker colorIndex={11} x:bind="$page.p2.x" size={10} draggableX  />
                     <Marker colorIndex={8} y:bind="$page.p1.y" size={10} draggableY />
                     <Marker colorIndex={8} y:bind="$page.p2.y" size={10} draggableY />
                  </Chart>
               </Svg>
               <Legend />
            </div>
         `}</CodeSnippet>
      </CodeSplit>

       Examples:

       * [Timeline](~/examples/charts/bar/timeline)

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

