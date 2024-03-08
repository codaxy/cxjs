import { Content, HtmlElement, Tab } from "cx/widgets";
import { Svg, Rectangle } from "cx/svg";
import { Chart, NumericAxis, Gridlines, Swimlanes } from "cx/charts";
import { Md } from "../../components/Md";
import { CodeSplit } from "../../components/CodeSplit";
import { CodeSnippet } from "../../components/CodeSnippet";
import { ConfigTable } from "../../components/ConfigTable";
import { ImportPath } from "docs/components/ImportPath";

// import configs from "./configs/Swimlanes";

export const SwimlanesPage = (
   <cx>
      <Md>
         # Swimlanes
         <ImportPath path="import {Swimlanes} from 'cx/charts';" />
         The `Swimlanes` widget is used to draw horizontal and vertical swimlanes, usually in the chart backgrounds.
         Beside aesthetics, swimlanes make it easier to read axis values.
         <CodeSplit>
            <div class="widgets">
               <Svg style="width:400px;height:400px;border:1px solid #ddd" margin="10 20 30 50">
                  <Chart
                     axes={{
                        x: <NumericAxis />,
                        y: <NumericAxis vertical />,
                     }}
                  >
                     <Rectangle fill="white" />
                     <Swimlanes />
                  </Chart>
               </Svg>
            </div>
            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />

               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="ojtJNYFd">{`
                <Svg style="width:300px;height:200px" margin="10 20 30 50">
                <Chart axes={{
                    x: <NumericAxis />,
                    y: <NumericAxis vertical/>
                }}>
                    <Rectangle fill="white" />
                    <Gridlines />
                </Chart>
                </Svg>
            `}</CodeSnippet>
            </Content>
         </CodeSplit>
         ## Configuration
         {/* <ConfigTable props={configs} /> */}
      </Md>
   </cx>
);
