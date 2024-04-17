import { Content, Controller, Repeater } from "cx/ui";
import { ImportPath } from "../../components/ImportPath";
import { CodeSplit } from "../../components/CodeSplit";
import { Svg } from "cx/svg";
import { CategoryAxis, Chart, Column, Legend, NumericAxis } from "cx/charts";
import { Tab } from "cx/widgets";
import { CodeSnippet } from "../../components/CodeSnippet";
import { ConfigTable } from "../../components/ConfigTable";
import { Md } from "../../components/Md";
import { casual } from "../examples/data/casual";
import { Swimlane } from "cx/src/charts";
class PageController extends Controller {
    onInit() {
        this.store.set('$page.points', Array.from({length: 3}, (_, i) => ({
            y: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10,
            x: casual.city
        })));
     }
}

export const SwimlanePage = (
    <cx>
       <Md>
          # Swimlane
          <ImportPath path="import {Swimlane} from 'cx/charts';" />
          {/* The `Swimlane` widget is used to draw horizontal and vertical swimlane, usually in the chart backgrounds.
          Beside aesthetics, swimlane make it easier to read axis values. */}
          <CodeSplit>
             <div class="widgets" controller={PageController}>
                <Svg style="width:500px; height:400px;">
                <Chart
                     offset="20 -20 -30 150"
                     axes={{
                        x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                        y: { type: NumericAxis, vertical: true } }}
                  >
                    <Repeater records-bind="$page.points" recordAlias="$point">
                        <Swimlane size={0.8} x-bind="$point.x" y-bind="$point.y" vertical/>
                     </Repeater>
                   </Chart>
                </Svg>
                <Legend vertical />
             </div>
             <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />
 
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="PAiR9Bc5">{`
                  <div class="widgets" controller={PageController}>
                     
                  </div>
             `}</CodeSnippet>
             </Content>
          </CodeSplit>
          ## Configuration
          {/* <ConfigTable props={configs} /> */}
       </Md>
    </cx>
 );