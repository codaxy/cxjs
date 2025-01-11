import { CategoryAxis, Chart, NumericAxis, Swimlane } from "cx/charts";
import { Svg } from "cx/svg";
import { Content, Controller, Repeater } from "cx/ui";
import { Tab } from "cx/widgets";
import { CodeSnippet } from "../../components/CodeSnippet";
import { CodeSplit } from "../../components/CodeSplit";
import { ImportPath } from "../../components/ImportPath";
import { Md } from "../../components/Md";
import { casual } from "../examples/data/casual";
import { ConfigTable } from "../../components/ConfigTable";

import configs from "./configs/Swimlane"

class PageController extends Controller {
    onInit() {
        this.store.set('$page.points', Array.from({length: 10}, (_, i) => ({
            numeric: 10 + (i+1) / 30 * 40 + (Math.random() - 0.5) * 10,
            category: casual.city
        })));
     }
}

export const SwimlanePage = (
    <cx>
       <Md controller={PageController}>
          # Swimlane
          <ImportPath path="import {Swimlane} from 'cx/charts';" />
          The `Swimlane` widget is used to make swimlane charts where each swimlane has unique properties or additional content inside.
          <CodeSplit>
             <div class="widgets" >
                <Svg style="width:500px; height:400px;">
                  <Chart offset="20 -20 -120 40" axes={{
                        x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                        y: { type: NumericAxis, vertical: true }
                  }}>
                     <Repeater records-bind="$page.points" recordAlias="$point">
                           <Swimlane size={0.8} x-bind="$point.category" vertical/>
                     </Repeater>
                  </Chart>
                </Svg>
             </div>
             <div class="widgets">
                <Svg style="width:700px; height:400px;">
                  <Chart offset="20 -100 -40 120" axes={{
                        x: { type: NumericAxis, snapToTicks: 0 },
                        y: { type: CategoryAxis, vertical: true }
                  }}>
                    <Repeater records-bind="$page.points" recordAlias="$point">
                        <Swimlane size={0.8} y-bind="$point.category" />
                     </Repeater>
                   </Chart>
                </Svg>
             </div>
             <Content name="code">
                <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />
                <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="nmbTYath">{`
                  <div class="widgets" >
                     <Svg style="width:500px; height:400px;">
                        <Chart offset="20 -20 -120 40" axes={{
                              x: { type: CategoryAxis, labelRotation: -90, labelDy: '0.4em', labelAnchor: "end" },
                              y: { type: NumericAxis, vertical: true }
                        }}>
                           <Repeater records-bind="$page.points" recordAlias="$point">
                                 <Swimlane size={0.8} x-bind="$point.category" vertical/>
                           </Repeater>
                        </Chart>
                     </Svg>
                  </div>
                  <div class="widgets">
                     <Svg style="width:700px; height:400px;">
                        <Chart offset="20 -100 -40 120" axes={{
                              x: { type: NumericAxis, snapToTicks: 0 },
                              y: { type: CategoryAxis, vertical: true }
                        }}>
                           <Repeater records-bind="$page.points" recordAlias="$point">
                              <Swimlane size={0.8} y-bind="$point.category" />
                           </Repeater>
                        </Chart>
                     </Svg>
                  </div>
             `}</CodeSnippet>
             </Content>
          </CodeSplit>
          ## Configuration
          <ConfigTable props={configs} />
       </Md>
    </cx>
 );