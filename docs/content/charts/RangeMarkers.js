import { CategoryAxis, Chart, Column, Gridlines, Marker, NumericAxis, RangeMarker } from "cx/charts";
import { Rectangle, Svg, Text } from "cx/svg";
import { Controller } from "cx/ui";
import { Content, Repeater, Tab } from "cx/widgets";
import { CodeSnippet } from "docs/components/CodeSnippet";
import { CodeSplit } from "docs/components/CodeSplit";
import { ImportPath } from "docs/components/ImportPath";
import { Md } from "docs/components/Md";

var categories = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

class PageController extends Controller {
   init() {
      super.init();
      var v1 = 200;
      this.store.set(
         "$points",
         Array.from({ length: categories.length }, (_, i) => ({
            x: categories[i],
            v1: (v1 = v1 + (Math.random() - 0.5) * 30),
            max: v1 + 30 * Math.random(),
            min: v1 - 30 * Math.random(),
            optimal: v1 - 10 * Math.random() + 5,
         })),
      );
   }
}

export const RangeMarkers = (
   <cx>
      <Md>
         <CodeSplit>
            # RangeMarkers
            <ImportPath path="import {RangeMarkers} from 'cx/charts';" />
            <div controller={PageController}>
               <Svg style="width:600px; height:400px;">
                  <Chart
                     offset="20 -20 -40 40"
                     axes={{
                        x: { type: CategoryAxis },
                        y: { type: NumericAxis, vertical: true },
                     }}
                  >
                     <Gridlines />
                     <Repeater records-bind="$points" recordAlias="$point">
                        <Column
                           colorIndex:expr="{$index}"
                           size={0.7}
                           offset={0}
                           x:bind="$point.x"
                           y:bind="$point.v1"
                           tooltip:tpl="{$point.x} {$point.v1:n}"
                        />
                        <RangeMarker
                           x-bind="$point.x"
                           y-bind="$point.max"
                           lineStyle="stroke: blue;"
                           size={0.7}
                           inflate={3}
                           shape="max"
                        />
                        <RangeMarker
                           x-bind="$point.x"
                           y-bind="$point.min"
                           lineStyle="stroke: red;"
                           size={0.7}
                           inflate={3}
                           shape="min"
                        />
                        <RangeMarker
                           x-bind="$point.x"
                           y-bind="$point.optimal"
                           lineStyle="stroke: green;"
                           size={0.7}
                           inflate={3}
                           shape="line"
                        />
                     </Repeater>
                  </Chart>
               </Svg>
            </div>
            <Content name="code">
               <Tab value-bind="$page.code.tab" mod="code" tab="controller" text="Controller" />
               <Tab value-bind="$page.code.tab" mod="code" tab="index" text="Index" default />
               <CodeSnippet visible-expr="{$page.code.tab}=='controller'" fiddle="SqfLY8YB">{`
               class PageController extends Controller {
                  onInit() {
                     this.store.set('$page.reds', Array.from({length: 50}, (_, i) => ({
                        x: 100+Math.random() * 300,
                        y: Math.random() * 300,
                        size: 10 + Math.random() * 30,
                        color: Math.floor(Math.random() * 3)
                     })));
                     this.store.set('$page.blues', Array.from({length: 50}, (_, i) => ({
                        x: Math.random() * 300,
                        y: 100 + Math.random() * 300,
                        size: 10 + Math.random() * 30,
                        color: 4 + Math.floor(Math.random() * 3)
                     })));
                  }
               }
            `}</CodeSnippet>
               <CodeSnippet visible-expr="{$page.code.tab}=='index'" fiddle="SqfLY8YB">{`
            <div class="widgets" controller={PageController}>
               <Svg style="width:500px; height:400px;">
                  <Chart offset="20 -20 -40 130" axes={{
                     x: { type: NumericAxis, snapToTicks: 1 },
                     y: { type: NumericAxis, vertical: true, snapToTicks: 1 }
                  }}>
                     <Gridlines/>
                     <Repeater records-bind="$page.reds" recordAlias="$point">
                        <Marker colorIndex-bind="$point.color"
                              legendColorIndex={1}
                              active-bind="$page.showReds"
                              name="Reds"
                              size-bind="$point.size"
                              x-bind="$point.x"
                              y-bind="$point.y"
                              tooltip-tpl="Red ({$point.x:n;0}, {$point.y:n;0})"
                              style={{fillOpacity: 0.5}}
                              draggableX draggableY
                        />
                     </Repeater>
                     <Repeater records-bind="$page.blues" recordAlias="$point">
                        <Marker colorIndex-bind="$point.color"
                              legendColorIndex={5}
                              active-bind="$page.showBlues"
                              name="Blues"
                              size-bind="$point.size"
                              x-bind="$point.x"
                              y-bind="$point.y"
                              tooltip-tpl="Blue ({$point.x:n;0}, {$point.y:n;0})"
                              style={{fillOpacity: 0.5}}
                              draggableX draggableY/>
                     </Repeater>
                  </Chart>
               </Svg>
               <Legend vertical />
            </div>
            `}</CodeSnippet>
            </Content>
         </CodeSplit>
         ## Configuration
         {/* <ConfigTable props={configs} /> */}
      </Md>
   </cx>
);
