import { Content, Controller, PropertySelection, KeySelection } from 'cx/ui';
import { HtmlElement, Repeater, Checkbox, Select, Option, Grid } from 'cx/widgets';
import { Svg, Rectangle } from 'cx/svg';
import { Chart, Gridlines, Bubbles, NumericAxis } from 'cx/charts';
import { Debug } from 'cx/util';
import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';





//Debug.enable('prepare');



class PageController extends Controller {
   init() {
      super.init();

      this.store.set('$page.bubbles', Array.from({length: 15}).map((v, i)=>({
         name: `Bubble ${i+1}`,
         x: Math.random() * 100,
         y: Math.random() * 100,
         r: Math.random() * 20,
         selected: i % 2 == 0
      })));
   }
}

export const Svgs = <cx>

   <Md controller={PageController}>

      <CodeSplit>
         <div class="widgets">
            <Svg style={{width: '400px', height:"400px"}}>
               <Chart anchors="0 1 1 0" offset="25 -25 -40 50" axes={NumericAxis.XY()}>
                  <Rectangle anchors="0 1 1 0" style={{fill: 'rgba(100, 100, 100, 0.1)'}} />
                  <Gridlines />
                  <Bubbles data:bind='$page.bubbles' selection={{type: PropertySelection, multiple: true}}/>
               </Chart>
            </Svg>
            <div>
               <Repeater records:bind="$page.bubbles">
                  <div>
                     <Checkbox checked:bind="$record.selected" text:bind="$record.name" />
                  </div>
               </Repeater>
            </div>
         </div>
      </CodeSplit>
   </Md>
</cx>;

