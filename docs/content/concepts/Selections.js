import {Md} from 'docs/components/Md';
import {CodeSplit} from 'docs/components/CodeSplit';
import {CodeSnippet} from 'docs/components/CodeSnippet';

import {HtmlElement} from 'cx/ui/HtmlElement';
import {Content} from 'cx/ui/layout/Content';

import {Repeater} from 'cx/ui/Repeater';
import {Checkbox} from 'cx/ui/form/Checkbox';
import {Select, Option} from 'cx/ui/form/Select';

import {Svg} from 'cx/ui/svg/Svg';
import {Rectangle} from 'cx/ui/svg/Rectangle';
import {Chart} from 'cx/ui/svg/charts/Chart';
import {Gridlines} from 'cx/ui/svg/charts/Gridlines';
import {BubbleGraph} from 'cx/ui/svg/charts/BubbleGraph';
import {NumericAxis} from 'cx/ui/svg/charts/axis/NumericAxis';
import {Grid} from 'cx/ui/grid/Grid';


import {Controller} from 'cx/ui/Controller';
import {PropertySelection} from 'cx/ui/selection/PropertySelection';
import {KeySelection} from 'cx/ui/selection/KeySelection';


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

export const Selections = <cx>

   <Md controller={PageController}>
      <CodeSplit>
         # Selections

         Some widgets allow the user to select one or more objects presented to them. If
         only one object can be selected at a time, that's called *single selection mode*. If multiple objects can
         be selected, that's *multiple selection mode*.

         The question here is what happens after the user selects something? There are multiple ways a selection can
         be handled and `Cx` offers commonly used methods out of the box.

         <Content name="code">
            <CodeSnippet>{`
               class PageController extends Controller {
                  init() {
                     super.init();

                     this.store.set('$page.bubbles', Array.from({length: 15}).map((v, i)=>({
                        name: \`Bubble \${i+1}\`,
                        x: Math.random() * 100,
                        y: Math.random() * 100,
                        r: Math.random() * 20,
                        selected: i % 2 == 0
                     })));
                  }
               }
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      ## Property Selection

      In this mode selection is handled by setting a designated selection property to be either `true` or `false`.
      Usually, `selected` property is used.

      This mode is easy to understand with a list of checkboxes. Each checkbox determine whether a corresponding record
      is selected or not.

      <CodeSplit>
         <div class="widgets">
            <Svg style={{width: '400px', height:"400px"}}>
               <Chart anchors="0 1 1 0" offset="25 -25 -40 50" axes={NumericAxis.XY()}>
                  <Rectangle anchors="0 1 1 0" style={{fill: 'rgba(100, 100, 100, 0.1)'}} />
                  <Gridlines />
                  <BubbleGraph data:bind='$page.bubbles' selection={{type: PropertySelection, multiple: true}}/>
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

         <Content name="code">
            <CodeSnippet>{`
               <div class="widgets" controller={PageController}>
                  <Svg style={{width: '400px', height:"400px"}}>
                     <Chart anchors="0 1 1 0" offset="25 -25 -40 50" axes={NumericAxis.XY()}>
                        <Rectangle anchors="0 1 1 0" style={{fill: 'rgba(100, 100, 100, 0.1)'}} />
                        <Grid />
                        <BubbleGraph data:bind='$page.bubbles' selection={{type: PropertySelection, multiple: true}}/>
                     </Chart>
                  </Svg>
                  <div>
                     <Repeater records:bind="$page.bubbles">
                        <div>
                           <Checkbox checked:bind="record.selected" text:bind="record.name" />
                        </div>
                     </Repeater>
                  </div>
               </div>
            `}</CodeSnippet>
         </Content>
      </CodeSplit>

      The `Ctrl` key can be used to toggle bubble selection.

      This mode is usually used for multiple selection, but it can be used for single selection too.

      Property selection mode is very fast for checking if a particular object is selected, however it needs to
      go through the whole list of objects to determine what is selected.

      ## Key Selection

      Key selection is a more common selection mode, where selected value(s) is stored in a separate variable.

      <CodeSplit>

         <div class="widgets">

            <Grid records:bind="$page.bubbles"
                  style={{width: "400px"}}
                  columns={[
                     { header: 'Name', field: 'name' },
                     { header: 'X', field: 'x', format: 'n;2', align: "right" },
                     { header: 'Y', field: 'y', format: 'n;2', align: "right" },
                     { header: 'R', field: 'r', format: 'n;2', align: "right" }
                  ]}
                  selection={{type: KeySelection, keyField: 'name', bind: '$page.selection'}}
            />

            <div>
               <Select value:bind="$page.selection">
                  <Repeater records:bind="$page.bubbles">                     <Option value:bind="$record.name" text:bind="$record.name" />
                  </Repeater>
               </Select>
            </div>
         </div>

         <Content name="code">
            <CodeSnippet>{`
               <Grid records:bind="$page.bubbles"
                     style={{width: "400px"}}
                     columns={[
                        { header: 'Name', field: 'name', sortable: true },
                        { header: 'X', field: 'x', sortable: true, format: 'n;2', align: "right" },
                        { header: 'Y', field: 'y', sortable: true, format: 'n;2', align: "right" },
                        { header: 'R', field: 'r', sortable: true, format: 'n;2', align: "right" }
                     ]}
                     selection={{type: KeySelection, keyField: 'name', bind: '$page.selection'}}
               />
               <div>
                  <Select value:bind="$page.selection">
                     <Repeater records:bind="$page.bubbles">
                        <Option value:bind="$record.name" text:bind="$record.name" />
                     </Repeater>
                  </Select>
               </div>
            `}</CodeSnippet>
         </Content>

      </CodeSplit>

      Key selection works similar to `select` control where only key (value) of the selected option represents the selection.

      Use `keyField` or `keyFields` to configure which fields form the record key.

      Use `bind` property to define where selected keys will be stored.

      Use `multiple` property to decide if multiple selection is allowed or not.
   </Md>

</cx>;

