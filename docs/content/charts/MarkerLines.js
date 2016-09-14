import {Md} from '../../components/Md';
import {CodeSplit} from '../../components/CodeSplit';
import {CodeSnippet} from '../../components/CodeSnippet';
import {ConfigTable} from '../../components/ConfigTable';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Controller} from 'cx/ui/Controller';

import {Svg} from 'cx/ui/svg/Svg';
import {Text} from 'cx/ui/svg/Text';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {MarkerLine} from 'cx/ui/svg/charts/MarkerLine';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {LineGraph} from 'cx/ui/svg/charts/LineGraph';
import {Legend} from 'cx/ui/svg/charts/Legend';

import configs from './configs/MarkerLine'

class PageController extends Controller {
   init() {
      super.init();
      var y = 100;
      this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
         x: i * 4,
         y: y = y + (Math.random() - 0.5) * 30
      })));

      this.addComputable('$page.extremes', ['$page.points'], points => {
         if (points.length == 0)
            return null;
         var min = points[0].y;
         var max = points[0].y;
         for (var i = 1; i < points.length; i++) {
            if (points[i].y < min)
               min = points[i].y;
            if (points[i].y > max)
               max = points[i].y;
         }
         return {
            min,
            max
         }
      });

      this.store.set('$page.p1', { x: 150, y: 250 });
      this.store.set('$page.p2', { x: 250, y: 350 });
   }
}


export const MarkerLines = <cx>
   <Md>
      <CodeSplit>
         # MarkerLine

         Marker lines can be used to highlight important values such as minimum or maximum.
         
         <div class="widgets" controller={PageController}>
            <Svg style="width:600px; height:400px;">
               <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                  <Gridlines/>
                  <MarkerLine y:bind="$page.extremes.min" colorIndex={6}>
                     <Text anchors="0 0 0 0" offset="5 0 0 5" dy="0.8em">Min</Text>
                  </MarkerLine>
                  <MarkerLine y:bind="$page.extremes.max" colorIndex={3}>
                     <Text anchors="0 0 0 0" offset="-5 0 0 5">Max</Text>
                  </MarkerLine>
                  <LineGraph data:bind="$page.points" colorIndex={0}  />
               </Chart>
            </Svg>
            <Legend />
         </div>

         <CodeSnippet putInto="code">{`
            class PageController extends Controller {
               init() {
                  super.init();
                  var y = 100;
                  this.store.set('$page.points', Array.from({length: 101}, (_, i) => ({
                     x: i * 4,
                     y: y = y + (Math.random() - 0.5) * 30
                  })));

                  this.addComputable('$page.extremes', ['$page.points'], points => {
                     if (points.length == 0)
                        return null;
                     var min = points[0].y;
                     var max = points[0].y;
                     for (var i = 1; i < points.length; i++) {
                        if (points[i].y < min)
                           min = points[i].y;
                        if (points[i].y > max)
                           max = points[i].y;
                     }
                     return {
                        min,
                        max
                     }
                  });

                  this.store.set('$page.p1', { x: 150, y: 250 });
                  this.store.set('$page.p2', { x: 250, y: 350 });
               }
            }
            ...
            <div class="widgets" controller={PageController}>
               <Svg style="width:600px; height:400px;">
                  <Chart offset="20 -10 -40 40" axes={{ x: { type: NumericAxis }, y: { type: NumericAxis, vertical: true } }}>
                     <Gridlines/>
                     <MarkerLine y:bind="$page.extremes.min" colorIndex={6}>
                        <Text anchors="0 0 0 0" offset="5 0 0 5" dy="0.8em">Min</Text>
                     </MarkerLine>
                     <MarkerLine y:bind="$page.extremes.max" colorIndex={3}>
                        <Text anchors="0 0 0 0" offset="-5 0 0 5">Max</Text>
                     </MarkerLine>
                     <LineGraph data:bind="$page.points" colorIndex={0}  />
                  </Chart>
               </Svg>
               <Legend />
            </div>
         `}</CodeSnippet>
      </CodeSplit>

      ## Configuration

      <ConfigTable props={configs} />

   </Md>
</cx>

