import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';
import {Content} from 'cx/ui/layout/Content';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Repeater} from 'cx/ui/Repeater';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Select, Option} from 'cx/ui/form/Select';

import {Svg} from 'cx/ui/svg/Svg';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {Bubbles} from 'cx/ui/svg/charts/series/BubbleGraph';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {Grid} from 'cx/ui/grid/Grid';


import {Controller} from 'cx/ui/Controller';
import {PropertySelection} from 'cx/ui/selection/PropertySelection';
import {KeySelection} from 'cx/ui/selection/KeySelection';

import {Debug} from 'cx/util/Debug';
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

